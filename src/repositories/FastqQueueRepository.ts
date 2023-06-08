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
  private queueMap = new Map<string, queueAsPromised<Task>>();

  constructor(private auctionRepo: AuctionRepositoryInterface) {}

  public async placeOffer(params: Task) {
    if (this.queueMap.has(params.auctionId)) {
      this.queueMap.get(params.auctionId)!.push(params);
    }

    const queue = fastq.promise(async (params: Task) => {
      await this.auctionRepo.placeOffer(
        params.auctionId,
        params.userId,
        params.amount
      );
    }, 1);
    queue.error(console.error);
    queue.drain = () => {
      this.queueMap.delete(params.auctionId);
    };

    this.queueMap.set(params.auctionId, queue);
  }

  public async findOfferInQueue(params: Partial<Task>) {
    if (!params.auctionId) return;
    const queueList = this.queueMap.get(params.auctionId)?.getQueue() ?? [];
    return queueList.find(
      (q) => q.auctionId === params.auctionId && q.userId === params.userId
    );
  }
}

export default FastqQueueRepository;
