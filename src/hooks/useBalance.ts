import { BalanceType } from "@/schema/Account";
import axios from "axios";
import { useQuery } from "react-query";

const PATH = "/api/account/balance";

const useBalance = () => {
  return useQuery({
    queryKey: [PATH],
    queryFn: async () => {
      const { data } = await axios.get<BalanceType>(PATH);
      return data;
    },
  });
};

export default useBalance;
