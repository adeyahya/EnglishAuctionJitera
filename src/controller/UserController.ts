import { Inject, Service } from "typedi";
import BaseController from "@/lib/http/BaseController";
import type UserRespositoryInterface from "@/repositories/UserRepositoryInterface";
import { NextApiRequest, NextApiResponse } from "next";

@Service()
class UserController extends BaseController {
  constructor(@Inject("user") private userRepo: UserRespositoryInterface) {
    super();
  }

  async get(req: NextApiRequest, res: NextApiResponse) {
    const users = await this.userRepo.all();
    return res.json(users);
  }
}

export default UserController;
