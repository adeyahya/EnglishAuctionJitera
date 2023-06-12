import { AuctionType, AuctionWithBidType } from "@/schema/Auction";

interface AuctionRepositoryInterface {
  all(userId?: string): Promise<AuctionWithBidType[]>;
  find(id: string): Promise<AuctionWithBidType>;
  create(
    auction: Pick<
      AuctionType,
      "title" | "startingPrice" | "description" | "userId"
    >
  ): Promise<AuctionWithBidType>;
  close(id: string): Promise<AuctionWithBidType>;
  publish(id: string): Promise<AuctionWithBidType>;
  placeOffer(id: string, userId: string, amount: number): Promise<void>;
  getCurrentOffer(id: string): Promise<number>;
}

export default AuctionRepositoryInterface;
