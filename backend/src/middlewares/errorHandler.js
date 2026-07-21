const { AppError } = require('../errors/AppError');

/**
 * Global error handler middleware.
 * Catches all errors thrown in controllers/services and returns
 * a standardized JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // If it's an operational error (AppError), use its status code
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors?.map((e) => e.message) || [err.message];
    return res.status(422).json({
      success: false,
      error: messages.length === 1 ? messages[0] : messages,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado',
    });
  }

  // Unknown / unexpected errors — log and return 500
  console.error('[ERROR]', err);

  return res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
  });
};

module.exports = errorHandler;
