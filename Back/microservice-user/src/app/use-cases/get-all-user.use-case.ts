import { UserRepository } from "../repositories/user.repository";

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    return await this.userRepository.getAllUsers();
  }
}
