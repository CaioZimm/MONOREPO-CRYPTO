const { z } = require('zod');
const { ValidationError } = require('../errors/AppError');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((e) => e.message);
      return next(new ValidationError(messages.length === 1 ? messages[0] : messages));
    }
    next(error);
  }
};

module.exports = { validate };
