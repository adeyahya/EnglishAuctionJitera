import QueueRepositoryInterface from "@/repositories/QueueRepositoryInterface";
import type AuctionRepositoryInterface from "@/repositories/AuctionRepositoryInterface";
import fastq from "fastq";
import type { queueAsPromised } from "fastq";

type Task = {
  auctionId: string;
  userId: string;
  amount: number;
};

class FastqQueueRepository implements QueueRepositoryInterface {
  private q: queueAsPromised<Task>;

  constructor(private auctionRepo: AuctionRepositoryInterface) {
    this.q = fastq.promise(async (arg: Task) => {
      await this.auctionRepo.placeOffer(arg.auctionId, arg.userId, arg.amount);
    }, 1);
    this.q.error(console.error);
  }

  public async placeOffer(params: Task) {
    this.q.push(params);
  }

  public async findOfferInQueue(params: Partial<Task>) {
    const queueList = this.q.getQueue();
    return queueList.find(
      (q) => q.auctionId === params.auctionId && q.userId === params.userId
    );
  }
}

export default FastqQueueRepository;
