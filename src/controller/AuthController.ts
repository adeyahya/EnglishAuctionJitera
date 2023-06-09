import ms from "ms";
import jwt from "jsonwebtoken";
import { Inject, Service } from "typedi";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

import type UserRespositoryInterface from "@/repositories/UserRepositoryInterface";
import HttpError from "@/lib/HttpError";
import {
  AuthReponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
} from "@/schema/Auth";

import { ValidateBody, ValidateResponse } from "@/lib/Validator";
import { comparePassword, hashPassword } from "@/lib/password";

// errors
const ErrorUserExist = new HttpError("User Already Exist");
const ErrorUserNotFound = new HttpError("User Not Found", 404);
const ErrorInvalidPassword = new HttpError("Invalid password", 400);

@Service()
class AuthController {
  constructor(@Inject("user") private userRepo: UserRespositoryInterface) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  @ValidateBody(LoginRequestDTO)
  @ValidateResponse(AuthReponseDTO)
  public async login(
    params: HttpParams,
    _: NextApiRequest,
    res: NextApiResponse
  ) {
    const user = await this.userRepo.findByEmail(params.body.email);
    if (!user) throw ErrorUserNotFound;

    const isPasswordValid = await comparePassword(
      params.body.password,
      user.password
    );

    if (!isPasswordValid) throw ErrorInvalidPassword;
    const token = jwt.sign(
      { email: user.email, name: user.name, id: user.id },
      "secret",
      {
        expiresIn: "12h",
      }
    );
    const cookie = serialize("authToken", token, {
      httpOnly: true,
      path: "/",
      sameSite: true,
      expires: new Date(new Date().getTime() + ms("12h")),
    });
    res.setHeader("Set-Cookie", cookie);

    return user;
  }

  @ValidateBody(RegisterRequestDTO)
  @ValidateResponse(AuthReponseDTO)
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
