export class EmailServiceError extends Error {
  constructor(message: string = "Error en el servicio de email.") {
    super(message);
    this.name = "EmailServiceError";
  }
}

export class EmailNotSentError extends EmailServiceError {
  constructor(message: string = "El email no pudo enviarse.") {
    super(message);
    this.name = "EmailNotSentError";
  }
}

export class InvalidEmailFormatError extends EmailServiceError {
  constructor(message: string = "El formato del email es inválido.") {
    super(message);
    this.name = "InvalidEmailFormatError";
  }
}

export class MissingEmailDataError extends EmailServiceError {
  constructor(message: string = "Faltan datos en la solicitud de envío de email.") {
    super(message);
    this.name = "MissingEmailDataError";
  }
}
