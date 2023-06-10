import { User } from "@prisma/client";

export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type RegisterRequestDTO = Omit<User, "id" | "createdAt" | "updatedAt">;
export type RegisterDTO = Omit<User, "password">;

interface AuthRepositoryInterface {
  login(params: LoginRequestDTO): Promise<string>;
  register(params: RegisterRequestDTO): Promise<RegisterDTO>;
}

export default AuthRepositoryInterface;
