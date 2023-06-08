import { Auction } from "@prisma/client";

export type AuctionRequestDTO = Omit<Auction, "id" | "status" | "publishedAt">;

interface AuctionRepositoryInterface {
  all(): Promise<Auction[]>;
  find(id: string): Promise<Auction>;
  create(auction: AuctionRequestDTO): Promise<Auction>;
  update(id: string, auction: Partial<AuctionRequestDTO>): Promise<Auction>;
  publish(id: string): Promise<Auction>;
  placeOffer(id: string, userId: string, amount: number): Promise<void>;
}

export default AuctionRepositoryInterface;
