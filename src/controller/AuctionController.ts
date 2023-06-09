import Validator from "@/lib/Validator";
import type AuctionRepositoryInterface from "@/repositories/AuctionRepositoryInterface";
import { AuctionDTO, AuctionRequestDTO } from "@/schema/Auction";
import { Inject, Service } from "typedi";

// validators
const validateAuctionRequest = Validator.createValidator(AuctionRequestDTO);
const validateAuctionResponse = Validator.createValidator(AuctionDTO);

@Service()
class AuctionController {
  constructor(
    @Inject("auction") private auctionRepo: AuctionRepositoryInterface
  ) {}

  public create = async (params: HttpParams) => {
    const body = { ...params.body, userId: params.auth?.id };
    validateAuctionRequest(body);
    const auction = await this.auctionRepo.create(body);
    return validateAuctionResponse(auction);
  };

  public list = async () => {
    return this.auctionRepo.all();
  };
}

export default AuctionController;
