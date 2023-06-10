import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resetDb = async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.auction.deleteMany(),
    prisma.bid.deleteMany(),
    prisma.transaction.deleteMany(),
  ]);
};

export default resetDb;
