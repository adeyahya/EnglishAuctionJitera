import AuctionRepositoryInterface, {
  AuctionRequestDTO,
} from "@/repositories/AuctionRepositoryInterface";
import { Auction, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PrismaAuctionRepository implements AuctionRepositoryInterface {
  public async all(): Promise<Auction[]> {
    return await prisma.auction.findMany();
  }

  public async create(auction: AuctionRequestDTO): Promise<Auction> {
    return await prisma.auction.create({
      data: { ...auction, status: "DRAFT" },
    });
  }

  public async find(id: string): Promise<Auction> {
    const auction = await prisma.auction.findUnique({ where: { id } });
    if (!auction) throw new Error("not found");
    return auction;
  }

  public async publish(id: string): Promise<Auction> {
    const auction = await prisma.auction.update({
      where: { id },
      data: {
        status: "OPEN",
        publishedAt: new Date(),
      },
    });
    return auction;
  }

  public async update(
    id: string,
    auction: Partial<AuctionRequestDTO>
  ): Promise<Auction> {
    return await prisma.auction.update({ where: { id }, data: auction });
  }
}

export default PrismaAuctionRepository;
