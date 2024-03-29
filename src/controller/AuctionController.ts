import {
  ErrorInvalidAuctionState,
  ErrorInvalidBid,
  ErrorNotEnoughBalance,
  ErrorUnauthorized,
} from "@/lib/HttpError";
import { Auth, ValidateBody, ValidateResponse } from "@/lib/Validator";
import type AccountRepositoryInterface from "@/repositories/interfaces/AccountRepositoryInterface";
import type AuctionRepositoryInterface from "@/repositories/interfaces/AuctionRepositoryInterface";
import {
  AuctionRequestDTO,
  AuctionWithBidDTO,
  BidRequestDTO,
} from "@/schema/Auction";
import { Type } from "@sinclair/typebox";
import { Inject, Service } from "typedi";

@Service()
class AuctionController {
  constructor(
    @Inject("auction") private auctionRepo: AuctionRepositoryInterface,
    @Inject("account") private accountRepo: AccountRepositoryInterface
  ) {
    this.create = this.create.bind(this);
    this.publish = this.publish.bind(this);
    this.view = this.view.bind(this);
    this.offer = this.offer.bind(this);
    this.all = this.all.bind(this);
  }

  @ValidateResponse(Type.Array(AuctionWithBidDTO))
  public async all(_: HttpParams, req: ApiRequest) {
    const userId = req.authUser?.id;
    return await this.auctionRepo.all(userId);
  }

  @Auth()
  @ValidateBody(AuctionRequestDTO)
  @ValidateResponse(AuctionWithBidDTO)
  public async create(params: HttpParams, req: ApiRequest) {
    const body = { ...params.body, userId: req.authUser.id };
    return await this.auctionRepo.create(body);
  }

  @Auth()
  @ValidateResponse(AuctionWithBidDTO)
  public async publish(params: HttpParams, req: ApiRequest, res: ApiResponse) {
    const id = params.params.id;
    const auction = await this.auctionRepo.find(id);
    if (auction.userId !== req.authUser.id || auction.status !== "DRAFT")
      throw ErrorUnauthorized;
    const result = await this.auctionRepo.publish(id);
    res.broadcastMessage("auction", result);
    return result;
  }

  @ValidateResponse(AuctionWithBidDTO)
  public async view(params: HttpParams, _: ApiRequest, res: ApiResponse) {
    const id = params.params.id;
    const auction = await this.auctionRepo.find(id);

    // lazily close auction on view
    if (
      auction.endedAt &&
      auction.endedAt.getTime() < new Date().getTime() &&
      auction.status !== "CLOSED"
    ) {
      const result = await this.auctionRepo.close(id);
      res.broadcastMessage("auction", result);
      return result;
    }
    return auction;
  }

  @Auth()
  @ValidateBody(BidRequestDTO)
  @ValidateResponse(AuctionWithBidDTO)
  public async offer(params: HttpParams, req: ApiRequest, res: ApiResponse) {
    const id = params.params.id;
    const userId = req.authUser.id;
    const { offer } = params.body;
    // make sure it's only offer the auction that in state OPEN
    const auction = await this.auctionRepo.find(id);
    if (auction.status !== "OPEN") throw ErrorInvalidAuctionState;

    // make sure it's not offering it's own auction
    if (auction.userId === userId) throw ErrorInvalidBid;

    // make sure the balance is enough
    const balance = await this.accountRepo.balance(userId);
    const availableBalance = balance.balance - balance.reserved;
    if (availableBalance < offer) throw ErrorNotEnoughBalance;

    await this.auctionRepo.placeOffer(id, userId, offer);
    const result = await this.auctionRepo.find(id);
    res.broadcastMessage("auction", result);
    return result;
  }
}

export default AuctionController;
