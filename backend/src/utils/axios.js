const axios = require('axios');
const redisClient = require('../../config/redis');
const { NotFoundError, AppError } = require('../errors/AppError');

// Função auxiliar para buscar a cotação USD -> BRL
async function getUsdBrlRate() {
  const cacheKey = 'fiat:usd_brl';
  const cached = await redisClient.get(cacheKey);
  if (cached) return parseFloat(cached);

  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', { timeout: 5000 });
    const rate = response.data.rates.BRL;
    await redisClient.set(cacheKey, rate.toString(), 'EX', 12 * 60 * 60);
    return rate;
  } catch (error) {
    return 5.50;
  }
}

const symbolMap = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'binancecoin': 'BNB',
  'solana': 'SOL',
  'ripple': 'XRP',
  'cardano': 'ADA',
  'dogecoin': 'DOGE',
  'polkadot': 'DOT',
  'litecoin': 'LTC',
  'chainlink': 'LINK'
};

async function getFallbackPrice(cryptoName) {
  try {
    const config = {
      timeout: 5000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    };
    const response = await axios.get(`https://api.coincap.io/v2/assets/${cryptoName}`, config);

    if (!response.data || !response.data.data) {
      throw new Error('Falha no payload do CoinCap');
    }

    const usdPrice = parseFloat(response.data.data.priceUsd);
    const brlRate = await getUsdBrlRate();

    return {
      usd: usdPrice,
      brl: usdPrice * brlRate
    };
  } catch (err) {
    console.warn(`CoinCap falhou para ${cryptoName}: ${err.message}. Tentando Coinbase (EUA seguro)...`);

    const ticker = symbolMap[cryptoName.toLowerCase()];
    if (ticker) {
      try {
        const coinbaseRes = await axios.get(`https://api.coinbase.com/v2/prices/${ticker}-USD/spot`, { timeout: 5000 });
        const usdPrice = parseFloat(coinbaseRes.data.data.amount);
        const brlRate = await getUsdBrlRate();

        return {
          usd: usdPrice,
          brl: usdPrice * brlRate
        };
      } catch (coinbaseErr) {
        console.error(`Coinbase também falhou: ${coinbaseErr.message}`);
      }
    }

    throw new AppError('Limite de requisições de todas as APIs atingido. Tente novamente em alguns minutos.', 429);
  }
}

exports.getConversion = async (cryptoName) => {
  const cacheKey = `conversion:${cryptoName}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoName}&vs_currencies=brl,usd`,
      { timeout: 5000 }
    );

    if (!response.data || Object.keys(response.data).length === 0) {
      throw new NotFoundError('Criptomoeda inválida ou não encontrada na CoinGecko');
    }

    if (!response.data[cryptoName]) {
      throw new NotFoundError('Criptomoeda inválida ou não encontrada');
    }

    const prices = {
      brl: response.data[cryptoName].brl,
      usd: response.data[cryptoName].usd,
    };

    await redisClient.set(cacheKey, JSON.stringify(prices), 'EX', 600); // Cache de 10 min

    return prices;
  } catch (error) {
    // Se o erro for NotFound (moeda não existe), não tentamos o fallback, apenas repassamos o erro
    if (error instanceof NotFoundError) {
      throw error;
    }

    console.warn(`CoinGecko falhou para ${cryptoName}, acionando sistema reserva CoinCap...`);

    const fallbackPrices = await getFallbackPrice(cryptoName);
    await redisClient.set(cacheKey, JSON.stringify(fallbackPrices), 'EX', 600);

    return fallbackPrices;
  }
};