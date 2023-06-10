import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resetDb = async () => {
  await prisma.$transaction([
    prisma.transaction.deleteMany(),
    prisma.auction.deleteMany(),
    prisma.bid.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};

export default resetDb;
