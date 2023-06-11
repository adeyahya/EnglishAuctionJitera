import { User } from "@prisma/client";
import { LoginRequestType } from "@/schema/Auth";

export type RegisterRequestDTO = Omit<User, "id" | "createdAt" | "updatedAt">;
export type RegisterDTO = Omit<User, "password">;

interface AuthRepositoryInterface {
  login(params: LoginRequestType): Promise<string>;
  register(params: RegisterRequestDTO): Promise<RegisterDTO>;
}

export default AuthRepositoryInterface;
