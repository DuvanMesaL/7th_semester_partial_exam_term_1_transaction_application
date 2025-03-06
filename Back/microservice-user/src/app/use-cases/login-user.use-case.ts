import { UserRepository } from "../repositories/user.repository";
import { UserNotFoundError, IncorrectPasswordError } from "../../exceptions/exception";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new UserNotFoundError();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new IncorrectPasswordError();

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    return { token };
  }
}
