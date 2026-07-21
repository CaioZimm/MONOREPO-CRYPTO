const authRepository = require('../repositories/authRepository');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { ValidationError, ConflictError, UnauthorizedError } = require('../errors/AppError');

exports.registerUser = async (name, email, password, confirmPassword) => {
  if (!name || !email || !password || !confirmPassword) {
    throw new ValidationError('Todos os campos são obrigatórios');
  }

  if (password.length < 6) {
    throw new ValidationError('A senha deve ter no mínimo 6 caracteres');
  }

  if (password !== confirmPassword) {
    throw new ValidationError('As senhas não estão iguais');
  }

  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    throw new ConflictError('Este e-mail já está sendo usado');
  }

  const passwordCrypt = await bcrypt.hash(password, 10);
  const newUser = {
    name,
    email,
    password: passwordCrypt,
  };

  return await authRepository.register(newUser);
};

exports.loginUser = async (email, password) => {
  if (!email || !password) {
    throw new ValidationError('Email e senha são obrigatórios');
  }

  const user = await authRepository.login(email);
  if (!user) {
    throw new UnauthorizedError('Credenciais incorretas');
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw new UnauthorizedError('Credenciais incorretas');
  }

  return user;
};

exports.updateProfile = async (userId, name, email, password, confirmPassword) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new UnauthorizedError('Usuário não encontrado');
  }

  if (email && email !== user.email) {
    const emailTaken = await User.findOne({ where: { email } });
    if (emailTaken && emailTaken.id !== userId) {
      throw new ConflictError('Este e-mail já está sendo usado por outra conta');
    }
  }

  const updatedFields = {};
  if (name) updatedFields.name = name;
  if (email) updatedFields.email = email;

  if (password && password.trim() !== '') {
    if (password.length < 6) {
      throw new ValidationError('A nova senha deve ter no mínimo 6 caracteres');
    }
    if (password !== confirmPassword) {
      throw new ValidationError('As senhas não conferem');
    }
    updatedFields.password = await bcrypt.hash(password, 10);
  }

  return await authRepository.updateProfile(userId, updatedFields);
};