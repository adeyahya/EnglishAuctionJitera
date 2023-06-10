import { Auction } from "@prisma/client";
import { AuctionType, BidType } from "@/schema/Auction";

interface AuctionRepositoryInterface {
  all(): Promise<AuctionType[]>;
  find(id: string): Promise<AuctionType>;
  create(
    auction: Pick<
      AuctionType,
      "title" | "startingPrice" | "description" | "userId"
    >
  ): Promise<AuctionType>;
  update(id: string, auction: any): Promise<Auction>;
  publish(id: string): Promise<AuctionType>;
  getHighestBid(id: string): Promise<BidType | null>;
  placeOffer(id: string, userId: string, amount: number): Promise<void>;
  getCurrentOffer(id: string): Promise<number>;
}

export default AuctionRepositoryInterface;
