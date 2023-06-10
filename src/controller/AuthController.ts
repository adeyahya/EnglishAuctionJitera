import { Inject, Service } from "typedi";

import type UserRespositoryInterface from "@/repositories/UserRepositoryInterface";
import HttpError from "@/lib/HttpError";
import {
  AuthResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
} from "@/schema/Auth";

import { Auth, ValidateBody, ValidateResponse } from "@/lib/Validator";
import { comparePassword, hashPassword } from "@/lib/password";

// errors
const ErrorUserExist = new HttpError("User Already Exist");
const ErrorUserNotFound = new HttpError("User Not Found", 404);
const ErrorInvalidPassword = new HttpError("Invalid password", 400);

@Service()
class AuthController {
  constructor(@Inject("user") private userRepo: UserRespositoryInterface) {
    this.user = this.user.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  @Auth()
  @ValidateResponse(AuthResponseDTO)
  public async user(_: HttpParams, req: ApiRequest) {
    const user = await this.userRepo.find(req.authUser.id);
    return user;
  }

  @ValidateBody(LoginRequestDTO)
  @ValidateResponse(AuthResponseDTO)
  public async login(params: HttpParams, _: ApiRequest, res: ApiResponse) {
    const user = await this.userRepo.findByEmail(params.body.email);
    if (!user) throw ErrorUserNotFound;
    const isPasswordValid = await comparePassword(
      params.body.password,
      user.password
    );
    if (!isPasswordValid) throw ErrorInvalidPassword;
    res.setAuth({ email: user.email, name: user.name, id: user.id });
    return user;
  }

  @ValidateBody(RegisterRequestDTO)
  @ValidateResponse(AuthResponseDTO)
  public async register(params: HttpParams) {
    const existingUser = await this.userRepo.findByEmail(params.body.email);
    if (existingUser) throw ErrorUserExist;

    const hashedPassword = await hashPassword(params.body.password);
    return await this.userRepo.create({
      ...params.body,
      password: hashedPassword,
    });
  }
}

export default AuthController;
