import "@/lib/injectContainer";
import UserController from "@/controller/UserController";
import createNextHandler from "@/lib/http/createNextHandler";

export default createNextHandler(UserController);
