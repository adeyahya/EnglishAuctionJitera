import injectContainers from "@/lib/injectContainer";
import BaseController from "@/lib/http/BaseController";
import { NextApiRequest, NextApiResponse } from "next";
import Container, { Constructable } from "typedi";

const createNextHandler =
  (Controller: Constructable<BaseController>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      injectContainers();
      const controller = Container.get(Controller);
      switch (req.method) {
        case "GET":
          return await controller.get(req, res);
        case "POST":
          return await controller.post(req, res);
        case "PUT":
          return await controller.put(req, res);
        case "PATCH":
          return await controller.patch(req, res);
        case "DELETE":
          return await controller.delete(req, res);
        default:
          return await controller.get(req, res);
      }
    } catch (error) {
      console.error(error);
      res.status(500).end("internal server error");
    }
  };

export default createNextHandler;
