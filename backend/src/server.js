const http = require('http');
const sequelize = require('../config/database');
require('dotenv').config();

const app = require('./app');
const wsService = require('./services/wsService');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8000;

const server = http.createServer(app);

sequelize
  .authenticate()
  .then(() => {
    console.log('Banco de dados conectado!');

    wsService.init(server);

    server.listen(port, host, () => {
      console.log(`Servidor HTTP/WebSocket rodando em http://${host}:${port}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Documentação Swagger em http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar com o banco:', err.message);
    process.exit(1);
  });
