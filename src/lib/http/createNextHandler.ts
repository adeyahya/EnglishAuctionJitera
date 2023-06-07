import injectContainers from "@/lib/injectContainer";
import BaseController from "@/lib/http/BaseController";
import { NextApiRequest, NextApiResponse } from "next";
import Container, { Constructable } from "typedi";

const createNextHandler =
  (Controller: Constructable<BaseController>) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    injectContainers();
    const controller = Container.get(Controller);

    switch (req.method) {
      case "GET":
        return controller.get(req, res);
      case "POST":
        return controller.post(req, res);
      case "PUT":
        return controller.put(req, res);
      case "PATCH":
        return controller.patch(req, res);
      case "DELETE":
        return controller.delete(req, res);
      default:
        return controller.get(req, res);
    }
  };

export default createNextHandler;
