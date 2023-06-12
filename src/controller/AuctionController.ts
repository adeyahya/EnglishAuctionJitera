import {
  ErrorInvalidAuctionState,
  ErrorInvalidBid,
  ErrorNotEnoughBalance,
} from "@/lib/HttpError";
import { Auth, ValidateBody, ValidateResponse } from "@/lib/Validator";
import type AccountRepositoryInterface from "@/repositories/interfaces/AccountRepositoryInterface";
import type AuctionRepositoryInterface from "@/repositories/interfaces/AuctionRepositoryInterface";
import {
  AuctionDTO,
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
  @ValidateResponse(AuctionDTO)
  public async create(params: HttpParams, req: ApiRequest) {
    const body = { ...params.body, userId: req.authUser.id };
    return await this.auctionRepo.create(body);
  }

  @Auth()
  @ValidateResponse(AuctionDTO)
  public async publish(params: HttpParams) {
    const id = params.params.id;
    return await this.auctionRepo.publish(id);
  }

  @ValidateResponse(AuctionDTO)
  public async view(params: HttpParams) {
    const id = params.params.id;
    const auction = await this.auctionRepo.find(id);

    // lazily close auction on view
    if (
      auction.endedAt &&
      auction.endedAt.getTime() < new Date().getTime() &&
      auction.status !== "CLOSED"
    ) {
      return await this.auctionRepo.close(id);
    }
    return auction;
  }

  @Auth()
  @ValidateBody(BidRequestDTO)
  @ValidateResponse(AuctionDTO)
  public async offer(params: HttpParams, req: ApiRequest) {
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
    return await this.auctionRepo.find(id);
  }
}

export default AuctionController;
