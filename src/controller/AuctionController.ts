import { Auth, ValidateBody, ValidateResponse } from "@/lib/Validator";
import type AuctionRepositoryInterface from "@/repositories/interfaces/AuctionRepositoryInterface";
import { AuctionDTO, AuctionRequestDTO } from "@/schema/Auction";
import { Inject, Service } from "typedi";

@Service()
class AuctionController {
  constructor(
    @Inject("auction") private auctionRepo: AuctionRepositoryInterface
  ) {
    this.create = this.create.bind(this);
    this.publish = this.publish.bind(this);
    this.view = this.view.bind(this);
  }

  @Auth()
  @ValidateBody(AuctionRequestDTO)
  @ValidateResponse(AuctionDTO)
  public async create(params: HttpParams, req: ApiRequest) {
    const body = { ...params.body, userId: req.authUser.id };
    return await this.auctionRepo.create(body);
  }

  @Auth()
  // @ValidateResponse(AuctionDTO)
  public async publish(params: HttpParams) {
    const id = params.params.id;
    return await this.auctionRepo.publish(id);
  }

  // @ValidateResponse(AuctionDTO)
  public async view(params: HttpParams) {
    const id = params.params.id;
    return await this.auctionRepo.find(id);
  }
}

export default AuctionController;
