"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountCreationError = exports.NotificationServiceError = exports.LogServiceError = exports.ExternalServiceError = exports.TransactionDependencyError = exports.ServiceUnavailableError = exports.DatabaseConnectionError = exports.CannotDeleteUserWithActiveTransactionsError = exports.DNIAlreadyInUseError = exports.EmailAlreadyInUseError = exports.MissingRequiredFieldsError = exports.InvalidAgeError = exports.UserCannotModifyOthersError = exports.TooManyRequestsError = exports.UnauthorizedError = exports.UserSuspendedError = exports.IncorrectPasswordError = exports.UserNotFoundError = exports.WeakPasswordError = exports.InvalidEmailError = exports.UserAlreadyExistsError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// ─── Excepciones de Usuario ───────────────────────────────────────────
class UserAlreadyExistsError extends AppError {
    constructor() {
        super("User already exists", 400);
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
class InvalidEmailError extends AppError {
    constructor() {
        super("Invalid email format", 400);
    }
}
exports.InvalidEmailError = InvalidEmailError;
class WeakPasswordError extends AppError {
    constructor() {
        super("Password does not meet security requirements", 400);
    }
}
exports.WeakPasswordError = WeakPasswordError;
class UserNotFoundError extends Error {
    constructor() {
        super("User not found");
        this.name = "UserNotFoundError";
        this.statusCode = 404;
    }
}
exports.UserNotFoundError = UserNotFoundError;
class IncorrectPasswordError extends AppError {
    constructor() {
        super("Incorrect password", 401);
    }
}
exports.IncorrectPasswordError = IncorrectPasswordError;
class UserSuspendedError extends AppError {
    constructor() {
        super("User account is suspended", 403);
    }
}
exports.UserSuspendedError = UserSuspendedError;
class UnauthorizedError extends AppError {
    constructor() {
        super("Unauthorized access", 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class TooManyRequestsError extends AppError {
    constructor() {
        super("Too many failed login attempts, please try again later", 429);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class UserCannotModifyOthersError extends AppError {
    constructor() {
        super("User cannot modify another user's data", 403);
    }
}
exports.UserCannotModifyOthersError = UserCannotModifyOthersError;
class InvalidAgeError extends AppError {
    constructor() {
        super("User must be at least 18 years old", 400);
    }
}
exports.InvalidAgeError = InvalidAgeError;
class MissingRequiredFieldsError extends AppError {
    constructor() {
        super("Missing required fields", 400);
    }
}
exports.MissingRequiredFieldsError = MissingRequiredFieldsError;
class EmailAlreadyInUseError extends AppError {
    constructor() {
        super("Email already in use", 400);
    }
}
exports.EmailAlreadyInUseError = EmailAlreadyInUseError;
class DNIAlreadyInUseError extends AppError {
    constructor() {
        super("Document number already in use", 400);
    }
}
exports.DNIAlreadyInUseError = DNIAlreadyInUseError;
class CannotDeleteUserWithActiveTransactionsError extends AppError {
    constructor() {
        super("User cannot be deleted due to active transactions", 400);
    }
}
exports.CannotDeleteUserWithActiveTransactionsError = CannotDeleteUserWithActiveTransactionsError;
// ─── Excepciones de Integración y Dependencias ─────────────────────────
class DatabaseConnectionError extends AppError {
    constructor() {
        super("Database connection error", 500);
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
class ServiceUnavailableError extends AppError {
    constructor(service) {
        super(`${service} service is unavailable`, 502);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class TransactionDependencyError extends AppError {
    constructor() {
        super("User cannot be deleted due to active transactions", 400);
    }
}
exports.TransactionDependencyError = TransactionDependencyError;
class ExternalServiceError extends AppError {
    constructor(service) {
        super(`Failed to communicate with ${service} service`, 502);
    }
}
exports.ExternalServiceError = ExternalServiceError;
class LogServiceError extends AppError {
    constructor() {
        super("Failed to log event in Log Service", 500);
    }
}
exports.LogServiceError = LogServiceError;
class NotificationServiceError extends AppError {
    constructor() {
        super("Failed to send notification via Mailing Service", 502);
    }
}
exports.NotificationServiceError = NotificationServiceError;
class AccountCreationError extends AppError {
    constructor() {
        super("Failed to create account for new user", 500);
    }
}
exports.AccountCreationError = AccountCreationError;
