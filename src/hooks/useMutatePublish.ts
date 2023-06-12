import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { AuctionWithBidType } from "@/schema/Auction";

const useMutatePublish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.post<AuctionWithBidType>(
        `/api/auction/${id}/publish`
      );
      return data;
    },
    onSuccess: (data) => {
      const prevData: AuctionWithBidType[] =
        queryClient.getQueryData("/api/auction") ?? [];
      const nextData = prevData.map((auction) => {
        if (auction.id === data.id) return data;
        return auction;
      });
      queryClient.setQueryData("/api/auction", nextData);
    },
  });
};

export default useMutatePublish;
