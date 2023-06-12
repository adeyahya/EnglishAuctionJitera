import { AuctionWithBidType } from "@/schema/Auction";
import axios from "axios";
import { useQuery } from "react-query";

const PATH = "/api/auction";

const useAuctionList = () => {
  return useQuery({
    queryKey: [PATH],
    queryFn: async () => {
      const { data } = await axios.get<AuctionWithBidType[]>(PATH);
      return data;
    },
  });
};

export default useAuctionList;
