import { UserRepository } from "../repositories/user.repository";
import {
  UnauthorizedActionError,
  NotFoundError,
  IncorrectPasswordError
} from "../../exceptions/exception";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new NotFoundError("Usuario no encontrado.");

    // No permitir login con cuentas eliminadas
    if (user.deletedAt) {
      throw new UnauthorizedActionError("Esta cuenta ha sido eliminada.");
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new IncorrectPasswordError("Contraseña incorrecta.");
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    return { token };
  }
}
