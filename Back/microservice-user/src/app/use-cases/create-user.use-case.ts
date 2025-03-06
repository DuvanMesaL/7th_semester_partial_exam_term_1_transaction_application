import { UserRepository } from "../repositories/user.repository";
import { UserCreationAttributes } from "../../models/user.model";
import bcrypt from "bcryptjs";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: UserCreationAttributes) {
    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear usuario en el repositorio
    return await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
  }
}
