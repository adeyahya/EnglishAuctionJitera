import "reflect-metadata";
import "@/lib/injectContainers";
import { Container } from "typedi";
import Router from "@/lib/http/Router";
import AuthController from "@/controller/AuthController";
import AuctionController from "@/controller/AuctionController";
import AccountController from "@/controller/AccountController";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const router = new Router();

/**
 * list of controllers
 * the controller should always accessed through Container
 * so it's dependencies can be injected by typedi
 */
const authController = Container.get(AuthController);
const auctionController = Container.get(AuctionController);
const accountController = Container.get(AccountController);

/**
 * route definition
 */
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/auth", authController.user);

router.post("/auction/:id/publish", auctionController.publish);
router.get("/auction/:id", auctionController.view);
router.post("/auction/:id", auctionController.offer);
router.post("/auction", auctionController.create);
router.get("/auction", auctionController.all);

router.post("/account/deposit", accountController.deposit);
router.get("/account/balance", accountController.balance);

type SocketMap = Map<
  string,
  Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
>;
Container.set("socketMap", new Map());

const handler = async (req: ApiRequest, res: ApiResponse) => {
  const _res: any = res;
  if (!_res.socket?.server?.io) {
    const io = new Server(_res.socket.server);
    _res.socket.server.io = io;

    io.on("connection", (socket) => {
      const socketMap: SocketMap = Container.get("socketMap");
      socketMap.set(socket.id, socket);
      socket.on("disconnect", () => {
        socketMap.delete(socket.id);
      });
    });
  }
  if (req.query.path?.[0] === "socket") return res.end();

  res.broadcastMessage = (message: string, payload: any) => {
    const socketMap: SocketMap = Container.get("socketMap");
    Array.from(socketMap).forEach(([, socket]) => {
      socket.broadcast.emit(message, payload);
    });
  };

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
