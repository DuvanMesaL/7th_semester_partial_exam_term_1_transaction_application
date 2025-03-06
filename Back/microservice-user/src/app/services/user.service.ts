import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import User from "../../models/user.model";
import sequelize from "../../infrastructure/database";

dotenv.config();

export class UserService {
  // 🟢 Crear un usuario con validación previa
  async createUser(userData: Partial<User>) {
    // 📌 Verificamos que las propiedades obligatorias no sean undefined
    if (!userData.name || !userData.lastname || !userData.age || !userData.email ||
        !userData.phone || !userData.gender || !userData.password ||
        !userData.documentType || !userData.documentNumber) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: userData.email }, { documentNumber: userData.documentNumber }],
      },
    });

    if (existingUser) {
      throw new Error("El correo o documento ya están en uso.");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 📌 Forzamos a que `userData` contenga los valores requeridos
    const newUser = await User.create({
      id: uuidv4(),  // ✅ Ahora `id` es un UUID válido
      name: userData.name,
      lastname: userData.lastname,
      age: userData.age,
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender,
      password: hashedPassword,
      documentType: userData.documentType,
      documentNumber: userData.documentNumber,
    });

    return newUser;
  }

  // 🔍 Obtener usuario por ID
  async getUserById(id: string) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }
    return user;
  }

  // 🔍 Obtener usuario por email
  async getUserByEmail(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }
    return user;
  }

  // 🔐 Validar credenciales de usuario (Login)
  async validateUser(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Credenciales inválidas.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Credenciales inválidas.");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return { token, user };
  }

  // ✏️ Actualizar usuario
  async updateUser(id: string, updatedData: Partial<User>) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    await user.update(updatedData);
    return user;
  }

  // 🚨 Eliminar usuario (Soft Delete)
  async deleteUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    await user.update({ deletedAt: new Date() });
    return { message: "Usuario eliminado correctamente." };
  }
}
