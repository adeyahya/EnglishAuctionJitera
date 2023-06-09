import { Inject, Service } from "typedi";
import { NextApiRequest, NextApiResponse } from "next";
import type UserRespositoryInterface from "@/repositories/UserRepositoryInterface";

@Service()
class UserController {
  constructor(@Inject("user") private userRepo: UserRespositoryInterface) {}

  public get = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.end(req.params.name);
  };
}

export default UserController;
