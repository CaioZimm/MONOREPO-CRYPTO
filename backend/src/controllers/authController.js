const authService = require('../services/authService');
const redisClient = require('../../config/redis');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/AppError');

const User = require('../models/User');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  path: '/',
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const user = await authService.registerUser(name, email, password, confirmPassword);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: { user: noPassword(user), token },
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Logado com sucesso',
      data: { user: noPassword(user), token },
    });
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('Token não fornecido');
    }

    // Decode to get expiration time
    const decoded = jwt.decode(token);
    const expiresIn = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 86400;

    // Add token to Redis blacklist until it expires naturally
    if (expiresIn > 0) {
      await redisClient.set(`blacklist:${token}`, 'true', 'EX', expiresIn);
    }

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado');
    }

    return res.status(200).json({
      success: true,
      data: { user: noPassword(user) },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, password, confirmPassword } = req.body;
    const user = await authService.updateProfile(userId, name, email, password, confirmPassword);

    return res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: { user: noPassword(user) },
    });
  } catch (error) {
    next(error);
  }
};

function noPassword(user) {
  const { password, ...userWithoutPassword } = user.dataValues || user;
  return userWithoutPassword;
}