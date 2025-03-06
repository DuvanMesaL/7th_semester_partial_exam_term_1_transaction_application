import { UserRepository } from "../repositories/user.repository";
import UserAttributes from "../../models/user.model"; 

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, updatedData: Partial<UserAttributes>) {
    return await this.userRepository.updateUser(id, updatedData);
  }
}
