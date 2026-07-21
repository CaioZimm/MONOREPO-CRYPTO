const redisClient = require('../../config/redis');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/AppError');

module.exports = async (req, res, next) => {
  const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next(new UnauthorizedError('Acesso negado. Token/sessão não encontrada.'));
  }

  try {
    // Check if token is blacklisted (user logged out)
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return next(new UnauthorizedError('Token ou sessão revogada/expirada.'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    return next(new UnauthorizedError('Token ou sessão inválida'));
  }
};