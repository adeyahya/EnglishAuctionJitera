import AuctionRepositoryInterface from "@/repositories/interfaces/AuctionRepositoryInterface";
import { Auction, Bid, PrismaClient } from "@prisma/client";
import { AuctionRequestType, AuctionType } from "@/schema/Auction";
import addHours from "date-fns/addHours";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { ErrorInsufficientOffer } from "@/lib/HttpError";

const prisma = new PrismaClient();

class PrismaAuctionRepository implements AuctionRepositoryInterface {
  constructor() {}

  // because status is depends on timestamp
  // I decided to compute it instead of storing it into column
  // because I think it's useless to store the status
  // if the actual source of truth is a time
  private computeStatus(auction: Auction) {
    if (!auction.publishedAt) return "DRAFT";
    if (!auction.endedAt) return "DRAFT";
    if (auction.endedAt.getTime() < new Date().getTime()) return "CLOSED";
    return "OPEN";
  }

  private transformAuction(auction: Auction) {
    return {
      ...auction,
      status: this.computeStatus(auction),
      timeWindow: auction.timeWindow.toNumber(),
      startingPrice: auction.startingPrice.toNumber(),
    };
  }

  private transformBid(bid: Bid | null) {
    if (!bid) return bid;
    return {
      ...bid,
      offer: bid.offer.toNumber(),
    };
  }

  public async all(): Promise<AuctionType[]> {
    const auctionList = await prisma.auction.findMany();
    return auctionList.map(this.transformAuction);
  }

  public async create(
    req: AuctionRequestType & { userId: string }
  ): Promise<AuctionType> {
    const auction = await prisma.auction.create({
      data: { ...req },
    });
    return this.transformAuction(auction);
  }

  public async getHighestBid(id: string) {
    const auction = await prisma.auction.findUnique({
      where: { id },
      select: { highestBidId: true },
    });
    if (auction?.highestBidId) {
      const highestBid = await prisma.bid.findUnique({
        where: { id: auction?.highestBidId },
      });
      return this.transformBid(highestBid);
    }
    return null;
  }

  public async find(id: string): Promise<AuctionType> {
    const auction = await prisma.auction.findUnique({ where: { id } });
    if (!auction) throw new Error("not found");
    return this.transformAuction(auction);
  }

  public async publish(id: string): Promise<AuctionType> {
    const now = new Date();
    const prevAuction = await this.find(id);
    const auction = await prisma.auction.update({
      where: { id },
      data: {
        endedAt: addHours(now, prevAuction?.timeWindow ?? 0),
        publishedAt: now,
      },
    });
    return this.transformAuction(auction);
  }

  public async update(id: string, auction: any): Promise<Auction> {
    return await prisma.auction.update({ where: { id }, data: auction });
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
      });

      if (myLastOfferAt?.createdAt) {
        const diffSec = differenceInSeconds(
          myLastOfferAt.createdAt,
          new Date()
        );
        if (diffSec < 60 * 5) {
          throw new Error("too fast, be patient");
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
        WHERE auction."endedAt" < NOW()
          AND bid."userId" = ${userId};`;

      const availableBalance =
        (balance._sum.amount?.toNumber() ?? 0) -
        +(reservedBalance?.[0]?.reserved ?? "0");

      if (amount > availableBalance) throw new Error("Insufficient Balance");

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
