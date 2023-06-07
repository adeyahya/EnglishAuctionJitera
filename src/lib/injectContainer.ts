import PrismaAccountRepository from "@/repositories/PrismaAccountRepository";
import PrismaTransactionRepository from "@/repositories/PrismaTransactionRepository";
import PrismaUserRepository from "@/repositories/PrismaUserRepository";
import Container from "typedi";

const injectContainers = () => {
  Container.set("user", new PrismaUserRepository());
  Container.set("transaction", new PrismaTransactionRepository());
  Container.set("account", new PrismaAccountRepository());
};

export default injectContainers;
