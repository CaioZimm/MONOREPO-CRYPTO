const axios = require('axios');
const redisClient = require('../../config/redis');
const { NotFoundError, AppError } = require('../errors/AppError');

exports.getConversion = async (cryptoName) => {
  const cacheKey = `conversion:${cryptoName}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoName}&vs_currencies=brl,usd`
    );

    if (!response.data[cryptoName]) {
      throw new NotFoundError('Criptomoeda inválida ou não encontrada');
    }

    const prices = {
      brl: response.data[cryptoName].brl,
      usd: response.data[cryptoName].usd,
    };

    await redisClient.set(cacheKey, JSON.stringify(prices), 'EX', 60);

    return prices;
  } catch (error) {
    // Re-throw our own errors
    if (error instanceof AppError) {
      throw error;
    }

    // CoinGecko API errors
    if (error.response?.status === 429) {
      throw new AppError('Limite de requisições da API atingido. Tente novamente em alguns minutos.', 429);
    }

    throw new AppError('Erro ao consultar a API de criptomoedas', 502);
  }
};