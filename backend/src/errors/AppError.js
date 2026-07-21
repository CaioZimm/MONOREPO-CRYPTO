class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Acesso negado') {
    super(message, 401);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Dados inválidos') {
    super(message, 422);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Recurso já existe') {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  ConflictError,
};
