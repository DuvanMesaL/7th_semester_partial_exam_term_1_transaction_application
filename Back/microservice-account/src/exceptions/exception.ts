export class AccountNotFoundError extends Error {
  constructor(message: string = "La cuenta no fue encontrada.") {
    super(message);
    this.name = "AccountNotFoundError";
  }
}

export class InsufficientFundsError extends Error {
  constructor(message: string = "Fondos insuficientes.") {
    super(message);
    this.name = "InsufficientFundsError";
  }
}

export class InvalidTransactionError extends Error {
  constructor(message: string = "La transacción es inválida.") {
    super(message);
    this.name = "InvalidTransactionError";
  }
}

export class UnauthorizedActionError extends Error {
  constructor(message: string = "Acción no permitida.") {
    super(message);
    this.name = "UnauthorizedActionError";
  }
}

export class MissingFieldsError extends Error {
  constructor(message: string = "Faltan datos obligatorios.") {
    super(message);
    this.name = "MissingFieldsError";
  }
}

export class AccountAlreadyExistsError extends Error {
  constructor(message: string = "El usuario ya tiene una cuenta registrada.") {
    super(message);
    this.name = "AccountAlreadyExistsError";
  }
}

export class TransactionNotFoundError extends Error {
  constructor(message: string = "La transacción no fue encontrada.") {
    super(message);
    this.name = "TransactionNotFoundError";
  }
}
