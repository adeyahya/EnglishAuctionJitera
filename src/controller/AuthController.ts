import { Inject, Service } from "typedi";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import ms from "ms";

import type UserRespositoryInterface from "@/repositories/UserRepositoryInterface";
import {
  AuthReponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
} from "@/schema/Auth";

import HttpError from "@/lib/HttpError";
import Validator from "@/lib/Validator";
import { comparePassword, hashPassword } from "@/lib/password";
import { NextApiRequest, NextApiResponse } from "next";

// validators
const validateLoginRequest = Validator.createValidator(LoginRequestDTO);
const validateRegisterRequest = Validator.createValidator(RegisterRequestDTO);
const validateAuthReponse = Validator.createValidator(AuthReponseDTO);

// errors
const ErrorUserExist = new HttpError("User Already Exist");
const ErrorUserNotFound = new HttpError("User Not Found", 404);
const ErrorInvalidPassword = new HttpError("Invalid password", 400);

@Service()
class AuthController {
  constructor(@Inject("user") private userRepo: UserRespositoryInterface) {}

  public login = async (
    params: HttpParams,
    _: NextApiRequest,
    res: NextApiResponse
  ) => {
    validateLoginRequest(params.body);

    const user = await this.userRepo.findByEmail(params.body.email);
    if (!user) throw ErrorUserNotFound;

    const isPasswordValid = await comparePassword(
      params.body.password,
      user.password
    );

    if (!isPasswordValid) throw ErrorInvalidPassword;
    const token = jwt.sign({ email: user.email, name: user.name }, "secret", {
      expiresIn: "12h",
    });
    const cookie = serialize("authToken", token, {
      httpOnly: true,
      path: "/",
      sameSite: true,
      expires: new Date(new Date().getTime() + ms("12h")),
    });
    res.setHeader("Set-Cookie", cookie);

    return validateAuthReponse(user);
  };

  public register = async (params: HttpParams) => {
    validateRegisterRequest(params.body);

    const existingUser = await this.userRepo.findByEmail(params.body.email);
    if (existingUser) throw ErrorUserExist;

    const hashedPassword = await hashPassword(params.body.password);
    const user = await this.userRepo.create({
      ...params.body,
      password: hashedPassword,
    });

    return validateAuthReponse(user);
  };
}

export default AuthController;
