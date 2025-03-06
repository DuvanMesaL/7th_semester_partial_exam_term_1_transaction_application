export class AppError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // ─── Excepciones de Usuario ───────────────────────────────────────────
  
  export class UserAlreadyExistsError extends AppError {
    constructor() {
      super("User already exists", 400);
    }
  }
  
  export class InvalidEmailError extends AppError {
    constructor() {
      super("Invalid email format", 400);
    }
  }
  
  export class WeakPasswordError extends AppError {
    constructor() {
      super("Password does not meet security requirements", 400);
    }
  }
  
  export class UserNotFoundError extends Error {
    statusCode: number;
  
    constructor() {
      super("User not found");
      this.name = "UserNotFoundError";
      this.statusCode = 404;
    }
  }
  
  export class IncorrectPasswordError extends AppError {
    constructor() {
      super("Incorrect password", 401);
    }
  }
  
  export class UserSuspendedError extends AppError {
    constructor() {
      super("User account is suspended", 403);
    }
  }
  
  export class UnauthorizedError extends AppError {
    constructor() {
      super("Unauthorized access", 401);
    }
  }
  
  export class TooManyRequestsError extends AppError {
    constructor() {
      super("Too many failed login attempts, please try again later", 429);
    }
  }
  
  export class UserCannotModifyOthersError extends AppError {
    constructor() {
      super("User cannot modify another user's data", 403);
    }
  }
  
  export class InvalidAgeError extends AppError {
    constructor() {
      super("User must be at least 18 years old", 400);
    }
  }
  
  export class MissingRequiredFieldsError extends AppError {
    constructor() {
      super("Missing required fields", 400);
    }
  }
  
  export class EmailAlreadyInUseError extends AppError {
    constructor() {
      super("Email already in use", 400);
    }
  }
  
  export class DNIAlreadyInUseError extends AppError {
    constructor() {
      super("Document number already in use", 400);
    }
  }

  export class CannotDeleteUserWithActiveTransactionsError extends AppError {
    constructor() {
      super("User cannot be deleted due to active transactions", 400);
    }
  }
  
  // ─── Excepciones de Integración y Dependencias ─────────────────────────
  
  export class DatabaseConnectionError extends AppError {
    constructor() {
      super("Database connection error", 500);
    }
  }
  
  export class ServiceUnavailableError extends AppError {
    constructor(service: string) {
      super(`${service} service is unavailable`, 502);
    }
  }
  
  export class TransactionDependencyError extends AppError {
    constructor() {
      super("User cannot be deleted due to active transactions", 400);
    }
  }
  
  export class ExternalServiceError extends AppError {
    constructor(service: string) {
      super(`Failed to communicate with ${service} service`, 502);
    }
  }
  
  export class LogServiceError extends AppError {
    constructor() {
      super("Failed to log event in Log Service", 500);
    }
  }
  
  export class NotificationServiceError extends AppError {
    constructor() {
      super("Failed to send notification via Mailing Service", 502);
    }
  }
  
  export class AccountCreationError extends AppError {
    constructor() {
      super("Failed to create account for new user", 500);
    }
  }