import { BalanceType } from "@/schema/Account";

interface AccountRepositoryInterface {
  deposit(userId: string, amount: number): Promise<BalanceType>;
  widraw(userId: string, amount: number): Promise<void>;
  balance(userId: string): Promise<BalanceType>;
}

export default AccountRepositoryInterface;
