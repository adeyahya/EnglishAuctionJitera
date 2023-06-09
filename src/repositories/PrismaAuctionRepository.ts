import AuctionRepositoryInterface from "@/repositories/AuctionRepositoryInterface";
import { Auction, PrismaClient } from "@prisma/client";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { AuctionRequestType, AuctionType } from "@/schema/Auction";

const prisma = new PrismaClient();

class PrismaAuctionRepository implements AuctionRepositoryInterface {
  public async all(): Promise<AuctionType[]> {
    const auctionList = await prisma.auction.findMany();
    return auctionList.map((auction) => ({
      ...auction,
      startingPrice: auction.startingPrice.toNumber(),
    }));
  }

  public async create(
    req: AuctionRequestType & { userId: string }
  ): Promise<AuctionType> {
    const auction = await prisma.auction.create({
      data: { ...req, status: "DRAFT" },
    });
    return {
      ...auction,
      startingPrice: auction.startingPrice.toNumber(),
    };
  }

  public async find(id: string): Promise<Auction> {
    const auction = await prisma.auction.findUnique({ where: { id } });
    if (!auction) throw new Error("not found");
    return auction;
  }

  public async publish(id: string): Promise<Auction> {
    const auction = await prisma.auction.update({
      where: { id },
      data: {
        status: "OPEN",
        publishedAt: new Date(),
      },
    });
    return auction;
  }

  public async update(id: string, auction: any): Promise<Auction> {
    return await prisma.auction.update({ where: { id }, data: auction });
  }

  public async placeOffer(id: string, userId: string, amount: number) {
    await prisma.$transaction(async (tx) => {
      const auction = await tx.auction.findFirst({
        where: {
          id,
          status: "OPEN",
          endedAt: {
            gt: new Date(),
          },
        },
      });

      if (!auction) throw new Error("invalid auction");
      if (auction.userId === userId)
        throw new Error("Cannot bid you own auction");

      const latestBid = await tx.bid.findFirst({
        where: { id: auction.bidId ?? "" },
      });
      const latestOffer = latestBid?.offer ?? auction.startingPrice;

      if (amount <= latestOffer.toNumber()) {
        throw new Error("Insufficient Offer");
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
            AND auction."bidId" = bid."id"
          WHERE auction."status" = 'OPEN'
            AND bid."userId" = ${userId};`;
      const availableBalance =
        (balance._sum.amount?.toNumber() ?? 0) -
        +(reservedBalance?.[0]?.reserved ?? "0");

      if (amount > availableBalance) throw new Error("Insufficient Balance");

      const newBid = await tx.bid.create({
        data: { userId, offer: amount, auctionId: id },
      });
      await tx.auction.update({ where: { id }, data: { bidId: newBid.id } });
    });
  }
}

export default PrismaAuctionRepository;
