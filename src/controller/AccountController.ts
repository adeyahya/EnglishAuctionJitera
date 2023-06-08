import BaseController from "@/lib/http/BaseController";
import type AccountRepositoryInterface from "@/repositories/AccountRepositoryInterface";
import type QueueRepositoryInterface from "@/repositories/QueueRepositoryInterface";
import { NextApiRequest, NextApiResponse } from "next";
import { Inject, Service } from "typedi";

@Service()
class AccountController extends BaseController {
  constructor(
    @Inject("account")
    private accountRepo: AccountRepositoryInterface,
    @Inject("queue")
    private queueRepo: QueueRepositoryInterface
  ) {
    super();
  }

  public async get(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;
    const balance = await this.accountRepo.balance(userId as string);
    return res.json(balance);
  }

  // deposit
  public async post(req: NextApiRequest, res: NextApiResponse) {
    const { userId, amount } = req.body;
    await this.accountRepo.deposit(userId, amount);
    return res.json({ status: "success" });
  }

  // widrawal
  public async put(req: NextApiRequest, res: NextApiResponse) {
    const { userId, amount } = req.body;
    await this.accountRepo.widraw(userId, amount);
    return res.json({ status: "success" });
  }

  public async patch(req: NextApiRequest, res: NextApiResponse) {
    const { userId, auctionId, amount } = req.body;
    await this.queueRepo.placeOffer({ userId, auctionId, amount });
    return res.json({ status: "success" });
  }
}

export default AccountController;
