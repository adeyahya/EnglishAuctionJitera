import { Auction } from "@prisma/client";
import { AuctionRequestType, AuctionType } from "@/schema/Auction";

interface AuctionRepositoryInterface {
  all(): Promise<AuctionType[]>;
  find(id: string): Promise<Auction>;
  create(auction: AuctionRequestType): Promise<AuctionType>;
  update(id: string, auction: any): Promise<Auction>;
  publish(id: string): Promise<Auction>;
  placeOffer(id: string, userId: string, amount: number): Promise<void>;
}

export default AuctionRepositoryInterface;
