import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { AuctionRequestType, AuctionType } from "@/schema/Auction";

const useMutateCreateAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AuctionRequestType) => {
      const { data } = await axios.post<AuctionType>("/api/auction", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("/api/auction");
    },
  });
};

export default useMutateCreateAuction;
