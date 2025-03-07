import { UserRepository } from "../repositories/user.repository";
import { UserCreationAttributes } from "../../models/user.model";
import {
  EmailAlreadyInUseError,
  PhoneNumberAlreadyInUseError,
  UnauthorizedActionError,
} from "../../exceptions/exception";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, updatedData: Partial<UserCreationAttributes>) {
    // No permitir cambiar `documentNumber` ni `documentType`
    if (updatedData.documentNumber || updatedData.documentType) {
      throw new UnauthorizedActionError("No puedes cambiar el número ni el tipo de documento.");
    }

    // Si se cambia el email, verificar que no esté en uso
    if (updatedData.email) {
      const existingUser = await this.userRepository.getUserByEmail(updatedData.email);
      if (existingUser) {
        throw new EmailAlreadyInUseError("El email ya está en uso.");
      }
    }

    // Si se cambia el número de teléfono, verificar que no esté en uso
    if (updatedData.phone) {
      const existingUser = await this.userRepository.getUserByPhone(updatedData.phone);
      if (existingUser) {
        throw new PhoneNumberAlreadyInUseError("El número de teléfono ya está en uso.");
      }
    }

    return await this.userRepository.updateUser(id, updatedData);
  }
}
