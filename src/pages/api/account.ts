import "reflect-metadata";
import "@/lib/injectContainer";
import AccountController from "@/controller/AccountController";
import createNextHandler from "@/lib/http/createNextHandler";

export default createNextHandler(AccountController);
