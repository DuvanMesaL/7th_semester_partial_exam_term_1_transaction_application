import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRepository } from "../repositories/user.repository";

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret_key";

export class RefreshTokenUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(refreshToken: string) {
    if (!refreshToken) throw new Error("Refresh Token requerido.");

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };
    const user = await this.userRepository.getUserById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Refresh Token inválido.");
    }

    const newAccessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: "15m" });

    return { accessToken: newAccessToken };
  }
}
