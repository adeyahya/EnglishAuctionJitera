import "reflect-metadata";
import "@/lib/injectContainer";
import { Container } from "typedi";
import { NextApiHandler } from "next";
import Router from "@/lib/http/Router";
import AuthController from "@/controller/AuthController";
import AuctionController from "@/controller/AuctionController";

const router = new Router();

/**
 * list of controllers
 * the controller should always accessed through Container
 * so it's dependencies can be injected by typedi
 */

const authController = Container.get(AuthController);
const auctionController = Container.get(AuctionController);

/**
 * route definition
 */
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/auction", auctionController.list);
router.post("/auction", auctionController.create, { isProtected: true });

const handler: NextApiHandler = async (req, res) => {
  try {
    const responseObject = await router.eval(req, res);
    return res.json(responseObject);
  } catch (error: any) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(error.errors);
    }

    console.error(error);
    res.status(520).end();
  }
};

export default handler;
