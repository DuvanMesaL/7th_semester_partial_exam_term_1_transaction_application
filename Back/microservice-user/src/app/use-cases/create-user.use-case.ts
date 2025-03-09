import { UserRepository } from "../repositories/user.repository";
import { UserCreationAttributes } from "../../models/user.model";
import bcrypt from "bcrypt";
import {
  EmailAlreadyInUseError,
  DNIAlreadyInUseError,
  PhoneNumberAlreadyInUseError,
  WeakPasswordError,
  MissingFieldsError,
  InvalidFormatError,
} from "../../exceptions/exception";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: UserCreationAttributes) {
    const { email, documentNumber, documentType, phone, password, name, lastname, age } = userData;

    if (!email || !documentNumber || !phone || !password || !name || !lastname || !age || !documentType) {
      throw new MissingFieldsError("Todos los campos son obligatorios.");
    }

    if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(name) || !/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(lastname)) {
      throw new InvalidFormatError("El nombre y apellido solo pueden contener letras y espacios.");
    }

    if (age < 18 || age > 100) {
      throw new InvalidFormatError("La edad debe estar entre 18 y 100 años.");
    }

    if (email.includes(" ") || password.includes(" ")) {
      throw new InvalidFormatError("El email y la contraseña no pueden contener espacios en blanco.");
    }

    const validDocumentTypes = ["DNI", "CC", "PASAPORTE"];
    if (!validDocumentTypes.includes(documentType)) {
      throw new InvalidFormatError("Tipo de documento inválido.");
    }

    const existingUserByEmail = await this.userRepository.getUserByEmail(email);
    if (existingUserByEmail) {
      throw new EmailAlreadyInUseError("El email ya está registrado.");
    }

    const existingUserByDocument = await this.userRepository.getUserByDocument(documentNumber);
    if (existingUserByDocument) {
      throw new DNIAlreadyInUseError(`El documento ${documentNumber} ya está registrado.`);
    }

    const existingUserByPhone = await this.userRepository.getUserByPhone(phone);
    if (existingUserByPhone) {
      throw new PhoneNumberAlreadyInUseError(`El número de teléfono ${phone} ya está registrado.`);
    }

    if (password.length < 6) {
      throw new WeakPasswordError("La contraseña debe tener al menos 6 caracteres.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
  }
}
