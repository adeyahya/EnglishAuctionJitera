import { BalanceType } from "@/schema/Account";

interface AccountRepositoryInterface {
  deposit(userId: string, amount: number): Promise<BalanceType>;
  balance(userId: string): Promise<BalanceType>;
}

export default AccountRepositoryInterface;
