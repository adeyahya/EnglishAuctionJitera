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
  }

  @Auth()
  @ValidateBody(AuctionRequestDTO)
  @ValidateResponse(AuctionDTO)
  public async create(params: HttpParams, req: ApiRequest) {
    const body = { ...params.body, userId: req.authUser.id };
    return await this.auctionRepo.create(body);
  }

  public list = async () => {
    return this.auctionRepo.all();
  };
}

export default AuctionController;
