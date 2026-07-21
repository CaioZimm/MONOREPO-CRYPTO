const conversionRepository = require('../repositories/conversionRepository');
const { getConversion } = require('../utils/axios');
const { ValidationError, NotFoundError } = require('../errors/AppError');

exports.registerConversion = async (userId, cryptoName, amount) => {
  if (!cryptoName || !amount) {
    throw new ValidationError('Informe uma moeda e uma quantidade para conversão');
  }

  if (amount <= 0) {
    throw new ValidationError('A quantidade deve ser maior que zero');
  }

  const { brl, usd } = await getConversion(cryptoName.toLowerCase());

  const conversion = {
    userId,
    cryptoName,
    amount,
    brl: brl * amount,
    usd: usd * amount,
  };

  return await conversionRepository.saveConversion(conversion);
};

exports.historyConversion = async (userId) => {
  const history = await conversionRepository.getHistory(userId);

  if (!history || history.length === 0) {
    throw new NotFoundError('Sem histórico até o momento');
  }

  return history;
};