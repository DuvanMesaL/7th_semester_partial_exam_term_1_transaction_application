import { UserRepository } from "../repositories/user.repository";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string) {
    return await this.userRepository.deleteUser(id);
  }
}
