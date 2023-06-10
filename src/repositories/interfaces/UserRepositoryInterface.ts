import { User } from "@prisma/client";

interface UserRespositoryInterface {
  all(): Promise<User[]>;
  find(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
}

export default UserRespositoryInterface;
