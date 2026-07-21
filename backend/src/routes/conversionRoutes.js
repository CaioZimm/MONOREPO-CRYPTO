const express = require('express');
const conversionController = require('../controllers/conversionController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { conversionSchema } = require('../validations/crypto.schema');

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Conversions
 *   description: Endpoints para cálculo de cotação com CoinGecko e registro no histórico do usuário
 */

/**
 * @swagger
 * /conversion:
 *   post:
 *     summary: Calcular cotação em USD e BRL para uma quantidade de criptomoeda e salvar no histórico
 *     tags: [Conversions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cryptoName, amount]
 *             properties:
 *               cryptoName:
 *                 type: string
 *                 example: bitcoin
 *               amount:
 *                 type: number
 *                 format: double
 *                 example: 0.5
 *     responses:
 *       201:
 *         description: Conversão realizada com sucesso e armazenada com precisão DECIMAL(18,8)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Conversor acessado com sucesso' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     brl: { type: number, example: 258420.50 }
 *                     usd: { type: number, example: 48920.10 }
 *                     cryptoName: { type: string, example: 'bitcoin' }
 *                     amount: { type: number, example: 0.5 }
 *       400:
 *         description: Erro ao buscar cotação na CoinGecko
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401:
 *         description: Não autorizado ou token ausente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       422:
 *         description: Falha na validação Zod (ex. quantidade negativa)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
routes.post('/conversion', authMiddleware, validate(conversionSchema), conversionController.registerConversion);

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Listar o histórico completo de conversões do usuário logado
 *     tags: [Conversions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transações e cotações anteriores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Criptomoeda armazenada com sucesso' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Conversion' }
 *       401:
 *         description: Não autorizado ou token revogado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
routes.get('/history', authMiddleware, conversionController.historyConversion);

module.exports = routes;