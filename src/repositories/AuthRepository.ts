import { comparePassword, hashPassword } from "@/lib/password";
import AuthRepositoryInterface, {
  RegisterRequestDTO,
} from "@/repositories/interfaces/AuthRepositoryInterface";
import UserRespositoryInterface from "@/repositories/interfaces/UserRepositoryInterface";
import { LoginRequestType } from "@/schema/Auth";
import jwt from "jsonwebtoken";

class AuthRepository implements AuthRepositoryInterface {
  constructor(private userRepo: UserRespositoryInterface) {}

  public async login(params: LoginRequestType) {
    const user = await this.userRepo.findByEmail(params.email);
    if (!user) throw new Error();
    const isPasswordValid = await comparePassword(
      params.password,
      user.password
    );
    if (!isPasswordValid) throw new Error();

    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.APP_SECRET ?? "supersecret",
      {
        expiresIn: "12h",
      }
    );

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
