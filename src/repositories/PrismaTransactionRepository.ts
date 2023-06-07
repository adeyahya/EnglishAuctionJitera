import TransactionRepositoryInterface from "@/repositories/TransactionRepositoryInterface";
import { PrismaClient, Transaction } from "@prisma/client";

const prisma = new PrismaClient();

class PrismaTransactionRepository implements TransactionRepositoryInterface {
  public async list(userId: string): Promise<Transaction[]> {
    return await prisma.transaction.findMany({ where: { userId } });
  }
}

export default PrismaTransactionRepository;
