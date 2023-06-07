import { Service } from "typedi";
import { PrismaClient, User } from "@prisma/client";
import UserRespositoryInterface from "@/repositories/UserRepositoryInterface";

const prisma = new PrismaClient();

@Service()
class PrismaUserRepository implements UserRespositoryInterface {
  public async all() {
    return await prisma.user.findMany();
  }

  public async find(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">) {
    return await prisma.user.create({ data });
  }
}

export default PrismaUserRepository;
