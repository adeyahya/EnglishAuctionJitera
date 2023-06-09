import "reflect-metadata";
import "@/lib/injectContainer";
import { Container } from "typedi";
import { NextApiHandler } from "next";
import Router from "@/lib/http/Router";
import UserController from "@/controller/UserController";
import AuthController from "@/controller/AuthController";

const router = new Router();

/**
 * list of controllers
 * the controller should always accessed through Container
 * so it's dependencies can be injected by typedi
 */

const authController = Container.get(AuthController);

/**
 * route definition
 */
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);

const handler: NextApiHandler = async (req, res) => {
  try {
    const responseObject = await router.eval(req, res);
    return res.json(responseObject);
  } catch (error: any) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(error.errors);
    }

    res.status(520).end();
  }
};

export default handler;
