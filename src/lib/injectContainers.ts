import Container from "typedi";
import FastqQueueRepository from "@/repositories/FastqQueueRepository";
import PrismaAccountRepository from "@/repositories/PrismaAccountRepository";
import PrismaAuctionRepository from "@/repositories/PrismaAuctionRepository";
import PrismaUserRepository from "@/repositories/PrismaUserRepository";
import AuthRepository from "@/repositories/AuthRepository";

const injectContainers = () => {
  const user = new PrismaUserRepository();
  const auth = new AuthRepository(user);
  const auction = new PrismaAuctionRepository();
  const account = new PrismaAccountRepository();
  const queue = new FastqQueueRepository(auction);

  Container.set("user", user);
  Container.set("auction", auction);
  Container.set("account", account);
  Container.set("queue", queue);
  Container.set("auth", auth);
};

injectContainers();

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
