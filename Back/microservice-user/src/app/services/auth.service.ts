import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../../models/user.model";

dotenv.config();

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

    // 🔍 Verificar que SECRET_KEY está definido antes de usarlo
    if (!process.env.SECRET_KEY) {
      throw new Error("Falta SECRET_KEY en el archivo .env");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY as string, // ✅ Forzamos a que TypeScript lo reconozca como string
      { expiresIn: "1h" }
    );

    return { token, user };
  }
}
