import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../../models/user.model";

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret_key";

export class AuthService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Credenciales incorrectas.");
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  }

  static async refreshToken(token: string) {
    if (!token) throw new Error("Refresh Token requerido.");

    const decoded = jwt.verify(token, REFRESH_SECRET) as { id: string };
    const user = await User.findByPk(decoded.id);

    if (!user || user.refreshToken !== token) throw new Error("Refresh Token inválido.");

    const newAccessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: "15m" });

    return { accessToken: newAccessToken };
  }

  static async logout(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("Usuario no encontrado.");

    user.refreshToken = null;
    await user.save();
  }
}
