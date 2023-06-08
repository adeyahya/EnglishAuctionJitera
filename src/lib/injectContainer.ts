import FastqQueueRepository from "@/repositories/FastqQueueRepository";
import PrismaAccountRepository from "@/repositories/PrismaAccountRepository";
import PrismaAuctionRepository from "@/repositories/PrismaAuctionRepository";
import PrismaUserRepository from "@/repositories/PrismaUserRepository";
import Container from "typedi";

const injectContainers = () => {
  const auction = new PrismaAuctionRepository();
  Container.set("user", new PrismaUserRepository());
  Container.set("auction", auction);
  Container.set("account", new PrismaAccountRepository());

  Container.set("queue", new FastqQueueRepository(auction));
};

export default injectContainers;
