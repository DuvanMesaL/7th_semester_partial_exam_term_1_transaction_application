import { UserRepository } from "../repositories/user.repository";

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async getById(id: string) {
    return await this.userRepository.getUserById(id);
  }

  async getByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }
}
