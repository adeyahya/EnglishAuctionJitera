import PrismaUserRepository from "@/repositories/PrismaUserRepository";
import Container from "typedi";

const injectContainers = () => {
  Container.set("user", new PrismaUserRepository());
};

export default injectContainers;
