const { Server } = require('socket.io');
const axios = require('axios');
const redis = require('../../config/redis');

let io = null;
let priceUpdateInterval = null;

const wsService = {
  /**
   * Inicializa o servidor Socket.io no servidor HTTP
   */
  init: (httpServer) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');

    io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    console.log('⚡ WebSocket (Socket.io) inicializado no servidor');

    io.on('connection', (socket) => {
      console.log(`🔌 Cliente WebSocket conectado: ${socket.id}`);

      // Enviar os dados em cache ou buscar logo que o cliente se conecta
      wsService.sendInitialData(socket);

      // O cliente pode se inscrever em moedas específicas se desejar
      socket.on('subscribe_coin', (data) => {
        if (data?.coinId) {
          socket.join(`coin_${data.coinId}`);
          console.log(`📌 Cliente ${socket.id} inscrito no feed de ${data.coinId}`);
        }
      });

      socket.on('unsubscribe_coin', (data) => {
        if (data?.coinId) {
          socket.leave(`coin_${data.coinId}`);
        }
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Cliente WebSocket desconectado: ${socket.id}`);
      });
    });

    // Iniciar poller periódico para transmitir cotações ao vivo
    wsService.startRealTimeFeed();
  },

  sendInitialData: async (socket) => {
    try {
      const cached = await redis.get('ws:market_prices');
      if (cached) {
        socket.emit('market_update', JSON.parse(cached));
      } else {
        await wsService.fetchAndBroadcastPrices();
      }
    } catch (err) {
      console.error('Erro no envio inicial do WebSocket:', err.message);
    }
  },

  /**
   * Busca preços em tempo real das principais criptos e emite evento via Socket.io
   */
  fetchAndBroadcastPrices: async () => {
    if (!io) return;

    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false',
        {
          headers: { 'User-Agent': 'Mozilla/5.0 (Nexus Crypto Engine)' },
          timeout: 8000,
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const payload = {
          timestamp: new Date().toISOString(),
          coins: response.data.map((c) => ({
            id: c.id,
            symbol: c.symbol,
            name: c.name,
            current_price: c.current_price,
            price_change_percentage_24h: c.price_change_percentage_24h,
            market_cap_rank: c.market_cap_rank,
            image: c.image,
          })),
        };

        // Cache no Redis por 120 segundos para poupar a API
        await redis.set('ws:market_prices', JSON.stringify(payload), 'EX', 120);

        // Transmitir para todos os clientes conectados
        io.emit('market_update', payload);

        // Também emitir eventos granulares para clientes inscritos em moedas específicas
        payload.coins.forEach((coin) => {
          io.to(`coin_${coin.id}`).emit('coin_price_update', coin);
        });
      }
    } catch (err) {
      // Falha silenciosa ou log leve para não inundar o console em caso de rate limit da CoinGecko
      console.warn('⚠️ [WS Feed] Falha ao atualizar preços CoinGecko:', err.message);
    }
  },

  startRealTimeFeed: () => {
    if (priceUpdateInterval) clearInterval(priceUpdateInterval);

    // Rodar a cada 2 minutos (120000ms) para respeitar limites públicos da API e não tomar 429
    priceUpdateInterval = setInterval(async () => {
      await wsService.fetchAndBroadcastPrices();
    }, 120000);
  },

  getIO: () => io,
};

module.exports = wsService;
