// Custom Error Class for API responses
export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date();
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message = "Validation failed", details = null) {
    super(message, 400, "VALIDATION_ERROR");
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You don't have permission to access this resource") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND_ERROR");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT_ERROR");
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}
