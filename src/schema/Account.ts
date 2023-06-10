import { Static, Type } from "@sinclair/typebox";

export const DepositRequestDTO = Type.Object({
  amount: Type.Number({}),
});
export type DepositRequestType = Static<typeof DepositRequestDTO>;

export const BalanceDTO = Type.Object({
  balance: Type.Number({}),
  reserved: Type.Number({}),
});
export type BalanceType = Static<typeof BalanceDTO>;
