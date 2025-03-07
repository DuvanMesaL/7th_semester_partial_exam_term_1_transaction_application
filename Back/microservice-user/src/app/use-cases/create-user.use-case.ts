import { UserRepository } from "../repositories/user.repository";
import { UserCreationAttributes } from "../../models/user.model";
import bcrypt from "bcryptjs";
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

    // Validar que los campos obligatorios estén presentes
    if (!email || !documentNumber || !phone || !password || !name || !lastname || !age || !documentType) {
      throw new MissingFieldsError("Todos los campos son obligatorios.");
    }

    // Validar que el nombre y apellido solo contengan letras y espacios
    if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(name) || !/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(lastname)) {
      throw new InvalidFormatError("El nombre y apellido solo pueden contener letras y espacios.");
    }

    // Validar edad mínima (18) y máxima (100)
    if (age < 18 || age > 100) {
      throw new InvalidFormatError("La edad debe estar entre 18 y 100 años.");
    }

    // No permitir email o password con espacios en blanco
    if (email.includes(" ") || password.includes(" ")) {
      throw new InvalidFormatError("El email y la contraseña no pueden contener espacios en blanco.");
    }

    // Validar `documentType` con valores permitidos
    const validDocumentTypes = ["DNI", "CC", "PASAPORTE"];
    if (!validDocumentTypes.includes(documentType)) {
      throw new InvalidFormatError("Tipo de documento inválido.");
    }

    // Validar si el email ya está en uso
    const existingUserByEmail = await this.userRepository.getUserByEmail(email);
    if (existingUserByEmail) {
      throw new EmailAlreadyInUseError("El email ya está registrado.");
    }

    // Validar si el documento ya está registrado
    const existingUserByDocument = await this.userRepository.getUserByDocument(documentNumber);
    if (existingUserByDocument) {
      throw new DNIAlreadyInUseError(`El documento ${documentNumber} ya está registrado.`);
    }

    // Validar si el número de teléfono ya está registrado
    const existingUserByPhone = await this.userRepository.getUserByPhone(phone);
    if (existingUserByPhone) {
      throw new PhoneNumberAlreadyInUseError(`El número de teléfono ${phone} ya está registrado.`);
    }

    // Validar si la contraseña es segura
    if (password.length < 6) {
      throw new WeakPasswordError("La contraseña debe tener al menos 6 caracteres.");
    }

    // Hash de la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en la base de datos
    return await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
  }
}
