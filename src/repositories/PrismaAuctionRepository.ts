import addHours from "date-fns/addHours";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { Auction, Bid, PrismaClient } from "@prisma/client";
import AuctionRepositoryInterface from "@/repositories/interfaces/AuctionRepositoryInterface";
import { AuctionRequestType, AuctionWithBidType } from "@/schema/Auction";
import { ErrorInsufficientOffer, ErrorInvalidDelay } from "@/lib/HttpError";

const prisma = new PrismaClient();

class PrismaAuctionRepository implements AuctionRepositoryInterface {
  constructor() {}

  private transformAuctionWithBid(
    auction: Auction & {
      bidList: (Bid & { author: { name: string } })[];
    }
  ) {
    return {
      ...auction,
      timeWindow: auction.timeWindow.toNumber(),
      startingPrice: auction.startingPrice.toNumber(),
      bidList: auction.bidList.map((bid) => ({
        ...bid,
        offer: bid.offer.toNumber(),
      })),
    };
  }

  public async all(userId?: string): Promise<AuctionWithBidType[]> {
    const auctionList = await prisma.auction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        OR: [
          {
            status: {
              in: ["OPEN", "CLOSED"],
            },
          },
          {
            ...(userId
              ? {
                  status: "DRAFT",
                  userId,
                }
              : {}),
          },
        ],
      },
      include: {
        bidList: {
          take: 1,
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return auctionList.map(this.transformAuctionWithBid);
  }

  public async create(req: AuctionRequestType & { userId: string }) {
    const auction = await prisma.auction.create({
      data: { ...req, status: "DRAFT" },
      include: {
        bidList: {
          take: 1,
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return this.transformAuctionWithBid(auction);
  }

  public async find(id: string) {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        bidList: {
          take: 1,
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!auction) throw new Error("not found");
    return this.transformAuctionWithBid(auction);
  }

  public async publish(id: string) {
    const now = new Date();
    const prevAuction = await this.find(id);
    const auction = await prisma.auction.update({
      where: { id },
      data: {
        endedAt: addHours(now, prevAuction?.timeWindow ?? 0),
        publishedAt: now,
        status: "OPEN",
      },
      include: {
        bidList: {
          take: 1,
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return this.transformAuctionWithBid(auction);
  }

  public async close(id: string) {
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT * FROM "Auction" WHERE "id"=${id} FOR UPDATE`;
      const auction = await tx.auction.findUnique({ where: { id } });
      if (auction?.highestBidId) {
        const bid = await tx.bid.findUnique({
          where: { id: auction.highestBidId },
        });
        if (!bid) throw {};

        // deduct bidder balance
        await tx.transaction.create({
          data: {
            amount: -bid.offer.toNumber(),
            type: "CREDIT",
            referenceId: bid.id,
            referenceType: "bid",
            userId: bid.userId,
          },
        });

        // increase author balance
        await tx.transaction.create({
          data: {
            amount: bid.offer.toNumber(),
            type: "DEBIT",
            referenceId: auction.id,
            referenceType: "auction",
            userId: auction.userId,
          },
        });
      }
      await tx.auction.update({ where: { id }, data: { status: "CLOSED" } });
    });
    return await this.find(id);
  }

  public async getCurrentOffer(id: string) {
    const auction = await prisma.auction.findUnique({
      where: { id },
    });
    if (auction?.highestBidId) {
      const bid = await prisma.bid.findUnique({
        where: { id: auction.highestBidId },
      });
      return bid?.offer?.toNumber() ?? 0;
    }
    return auction?.startingPrice?.toNumber() ?? 0;
  }

  public async placeOffer(id: string, userId: string, amount: number) {
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT * from "Auction" WHERE "id"=${id} FOR UPDATE`;
      await tx.$queryRaw`SELECT * from "Transaction" WHERE "userId"=${userId} FOR UPDATE`;
      await tx.$queryRaw`SELECT * from "Bid" WHERE "userId"=${userId} FOR UPDATE`;

      const auction = await tx.auction.findUnique({ where: { id } });
      const latestBid = await tx.bid.findUnique({
        where: { id: auction!.highestBidId ?? "" },
      });
      const startingPrice = auction?.startingPrice.toNumber() ?? 0;

      if (latestBid && latestBid.offer.toNumber() >= amount) {
        throw ErrorInsufficientOffer;
      }

      if (amount < startingPrice) {
        throw ErrorInsufficientOffer;
      }

      const myLastOfferAt = await tx.bid.findFirst({
        where: { auctionId: id, userId },
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
      });

      if (myLastOfferAt?.createdAt) {
        const diffSec = differenceInSeconds(
          myLastOfferAt.createdAt,
          new Date()
        );
        if (Math.abs(diffSec) < 5) {
          throw ErrorInvalidDelay;
        }
      }

      const balance = await tx.transaction.aggregate({
        where: {
          userId,
        },
        _sum: {
          amount: true,
        },
      });

      const reservedBalance = await tx.$queryRaw<{ reserved: string }[]>`
        SELECT COALESCE(SUM(bid.offer), 0) as reserved
        FROM "Bid" AS bid
        JOIN "Auction" AS auction
          ON bid."auctionId" = auction."id"
          AND auction."highestBidId" = bid."id"
        WHERE auction."status" = 'OPEN'
          AND bid."userId" = ${userId};`;

      const availableBalance =
        (balance._sum.amount?.toNumber() ?? 0) -
        +(reservedBalance?.[0]?.reserved ?? "0");

      if (amount > availableBalance) throw ErrorInsufficientOffer;

      const newBid = await tx.bid.create({
        data: { userId, offer: amount, auctionId: id },
      });

      await tx.auction.update({
        where: { id },
        data: { highestBidId: newBid.id },
      });
    });
  }
}

export default PrismaAuctionRepository;
