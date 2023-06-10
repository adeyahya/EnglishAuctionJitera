import { ErrorNegativeAmount } from "@/lib/HttpError";
import { Auth, ValidateBody, ValidateResponse } from "@/lib/Validator";
import type AccountRepositoryInterface from "@/repositories/AccountRepositoryInterface";
import { BalanceDTO, DepositRequestDTO } from "@/schema/Account";
import { Inject, Service } from "typedi";

@Service()
class AccountController {
  constructor(
    @Inject("account")
    private accountRepo: AccountRepositoryInterface
  ) {
    this.deposit = this.deposit.bind(this);
  }

  @Auth()
  @ValidateBody(DepositRequestDTO)
  @ValidateResponse(BalanceDTO)
  public async deposit(params: HttpParams, req: ApiRequest) {
    const { amount } = params.body;
    if (amount <= 0) throw ErrorNegativeAmount;
    await this.accountRepo.deposit(req.authUser.id, amount);
    return await this.accountRepo.balance(req.authUser.id);
  }
}

export default AccountController;
