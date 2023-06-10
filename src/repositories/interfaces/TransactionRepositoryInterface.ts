import { Transaction } from "@prisma/client";

interface TransactionRepositoryInterface {
  list(userId: string): Promise<Transaction[]>;
}

export default TransactionRepositoryInterface;
