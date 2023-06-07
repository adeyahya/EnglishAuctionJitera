export type BalanceDTO = {
  total: number;
  reserved: number;
};

interface AccountRepositoryInterface {
  deposit(userId: string, amount: number): Promise<void>;
  widraw(userId: string, amount: number): Promise<void>;
  balance(userId: string): Promise<BalanceDTO>;
}

export default AccountRepositoryInterface;
