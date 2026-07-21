const conversionService = require('../services/conversionService');

exports.registerConversion = async (req, res, next) => {
  try {
    const { cryptoName, amount } = req.body;
    const userId = req.user.id;

    const conversion = await conversionService.registerConversion(userId, cryptoName, amount);

    return res.status(201).json({
      success: true,
      message: 'Conversão registrada',
      data: conversion,
    });
  } catch (error) {
    next(error);
  }
};

exports.historyConversion = async (req, res, next) => {
  try {
    const history = await conversionService.historyConversion(req.user.id);

    return res.status(200).json({
      success: true,
      message: 'Histórico de conversões',
      data: history,
    });
  } catch (error) {
    next(error);
  }
};