import { PrismaClient } from "@prisma/client";
import AccountRepositoryInterface from "@/repositories/interfaces/AccountRepositoryInterface";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

class PrismaTransactionRepository implements AccountRepositoryInterface {
  public async deposit(userId: string, amount: number) {
    await prisma.transaction.create({
      data: {
        userId,
        amount,
        referenceId: faker.string.uuid(),
        referenceType: faker.finance.accountNumber(),
        type: "DEBIT",
      },
    });
    return await this.balance(userId);
  }

  public async balance(userId: string) {
    const reservedBalance = await prisma.$queryRaw<{ reserved: string }[]>`
      SELECT COALESCE(SUM(bid.offer), 0) as reserved
      FROM "Bid" AS bid
      JOIN "Auction" AS auction
        ON bid."auctionId" = auction."id"
        AND auction."highestBidId" = bid."id"
      WHERE auction."endedAt" > NOW()
        AND bid."userId" = ${userId};`;

    const balance = await prisma.transaction.aggregate({
      where: {
        userId,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      balance: balance._sum.amount?.toNumber() ?? 0,
      reserved: +(reservedBalance?.[0]?.reserved ?? "0"),
    };
  }
}

export default PrismaTransactionRepository;
