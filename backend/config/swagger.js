const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crypto Platform — REST API Documentation',
      version: '1.0.0',
      description: 'Documentação interativa da API de conversão e acompanhamento de criptomoedas em tempo real com segurança institucional, JWT, PostgreSQL e Redis.',
      contact: {
        name: 'Tech Lead / Caio',
        url: 'https://github.com/CaioZimm/MONOREPO-CRYPTO',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000/api/v1',
        description: 'Servidor de Desenvolvimento Local',
      },
      {
        url: '/api/v1',
        description: 'Servidor Atual (Relativo)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Envie o token JWT obtido no endpoint de login no formato: Bearer <TOKEN>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Caio Venancio' },
            email: { type: 'string', format: 'email', example: 'caio@empresa.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Conversion: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 101 },
            userId: { type: 'integer', example: 1 },
            cryptoName: { type: 'string', example: 'bitcoin' },
            amount: { type: 'number', format: 'double', example: 0.5 },
            brl: { type: 'number', format: 'double', example: 258420.50 },
            usd: { type: 'number', format: 'double', example: 48920.10 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Favorite: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 15 },
            userId: { type: 'integer', example: 1 },
            cryptoName: { type: 'string', example: 'ethereum' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operação realizada com sucesso' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Mensagem descritiva do erro ou falha de validação' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
