import { comparePassword, hashPassword } from "@/lib/password";
import AuthRepositoryInterface, {
  LoginRequestDTO,
  RegisterRequestDTO,
} from "@/repositories/AuthRepositoryInterface";
import UserRespositoryInterface from "@/repositories/UserRepositoryInterface";
import jwt from "jsonwebtoken";

class AuthRepository implements AuthRepositoryInterface {
  constructor(private userRepo: UserRespositoryInterface) {}

  public async login(params: LoginRequestDTO) {
    const user = await this.userRepo.findByEmail(params.email);
    if (!user) throw new Error();
    const isPasswordValid = await comparePassword(
      params.password,
      user.password
    );
    if (!isPasswordValid) throw new Error();

    const token = jwt.sign({ email: user.email, name: user.name }, "secret", {
      expiresIn: "12h",
    });

    return token;
  }

  public async register(params: RegisterRequestDTO) {
    const passwordHash = await hashPassword(params.password);
    const user = await this.userRepo.create({
      ...params,
      password: passwordHash,
    });

    return user;
  }
}

export default AuthRepository;
