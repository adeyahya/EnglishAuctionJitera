import axios from "axios";
import { useMutation, MutationOptions, useQueryClient } from "react-query";
import { BidRequestType } from "@/schema/Auction";

const useMutateBid = (
  id: string,
  opts: MutationOptions<BidRequestType, any, any> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BidRequestType) => {
      const { data } = await axios.post<BidRequestType>(
        `/api/auction/${id}`,
        payload
      );
      return data;
    },
    onError: opts.onError,
    onSuccess: (...args) => {
      queryClient.invalidateQueries("/api/account/balance");
      opts.onSuccess?.(...args);
    },
  });
};

export default useMutateBid;
