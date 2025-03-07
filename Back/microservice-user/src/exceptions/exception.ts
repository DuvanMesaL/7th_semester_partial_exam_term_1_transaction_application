export class EmailAlreadyInUseError extends Error {
  constructor(message: string = "El email ya está en uso.") {
    super(message);
    this.name = "EmailAlreadyInUseError";
  }
}

export class DNIAlreadyInUseError extends Error {
  constructor(message: string = "El documento ya está registrado.") {
    super(message);
    this.name = "DNIAlreadyInUseError";
  }
}

export class PhoneNumberAlreadyInUseError extends Error {
  constructor(message: string = "El número de teléfono ya está registrado.") {
    super(message);
    this.name = "PhoneNumberAlreadyInUseError";
  }
}

export class WeakPasswordError extends Error {
  constructor(message: string = "La contraseña debe tener al menos 6 caracteres.") {
    super(message);
    this.name = "WeakPasswordError";
  }
}

export class MissingFieldsError extends Error {
  constructor(message: string = "Todos los campos son obligatorios.") {
    super(message);
    this.name = "MissingFieldsError";
  }
}

export class InvalidFormatError extends Error {
  constructor(message: string = "El formato de un campo es incorrecto.") {
    super(message);
    this.name = "InvalidFormatError";
  }
}

export class UnauthorizedActionError extends Error {
  constructor(message: string = "Acción no permitida.") {
    super(message);
    this.name = "UnauthorizedActionError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Recurso no encontrado.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class IncorrectPasswordError extends Error {
  constructor(message: string = "Contraseña incorrecta.") {
    super(message);
    this.name = "IncorrectPasswordError";
  }
}
