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
      queryClient.setQueryData(
        "/api/auction",
        (data: any) => {
          console.log(data);
          return data.find((n: any) => n.id === data);
        },
        data as any
      );
    },
  });
};

export default useMutatePublish;
