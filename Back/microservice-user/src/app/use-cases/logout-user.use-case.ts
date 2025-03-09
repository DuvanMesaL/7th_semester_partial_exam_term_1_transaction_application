import { UserRepository } from "../repositories/user.repository";

export class LogoutUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new Error("Usuario no encontrado.");

    user.refreshToken = null;
    await user.save();
  }
}
