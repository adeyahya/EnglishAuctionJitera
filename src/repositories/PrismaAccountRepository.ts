import { PrismaClient } from "@prisma/client";
import AccountRepositoryInterface from "@/repositories/AccountRepositoryInterface";
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

  public async widraw(userId: string, amount: number) {
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`
        SELECT * FROM "Transaction" WHERE "userId" = ${userId} FOR UPDATE;
      `;

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

      if (amount > availableBalance) {
        throw new Error("Not Enough Balance");
      }

      await tx.transaction.create({
        data: {
          userId,
          amount: -Number(amount),
          referenceId: faker.string.uuid(),
          referenceType: faker.finance.accountNumber(),
          type: "CREDIT",
        },
      });
    });
  }

  public async balance(userId: string) {
    const reservedBalance = await prisma.$queryRaw<{ reserved: string }[]>`
      SELECT COALESCE(SUM(bid.offer), 0) as reserved
      FROM "Bid" AS bid
      JOIN "Auction" AS auction
        ON bid."auctionId" = auction."id"
        AND auction."bidId" = bid."id"
      WHERE auction."status" = 'OPEN'
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
