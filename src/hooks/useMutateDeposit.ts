import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { BalanceType, DepositRequestType } from "@/schema/Account";

const useMutateDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DepositRequestType) => {
      const { data } = await axios.post<BalanceType>(
        "/api/account/deposit",
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("/api/account/balance");
    },
  });
};

export default useMutateDeposit;
