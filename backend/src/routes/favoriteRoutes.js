const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { favoriteSchema } = require('../validations/crypto.schema');

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Endpoints para favoritar/desfavoritar criptomoedas no portfólio do usuário
 */

/**
 * @swagger
 * /favorites/toggle:
 *   post:
 *     summary: Alternar (adicionar ou remover) uma criptomoeda aos favoritos do usuário
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cryptoName]
 *             properties:
 *               cryptoName:
 *                 type: string
 *                 example: ethereum
 *     responses:
 *       200:
 *         description: Criptomoeda adicionada ou removida dos favoritos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Favoritado com sucesso' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     favorited: { type: boolean, example: true }
 *                     cryptoName: { type: string, example: 'ethereum' }
 *       401:
 *         description: Não autorizado ou token ausente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       422:
 *         description: Falha na validação do Zod
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
routes.post('/favorites/toggle', authMiddleware, validate(favoriteSchema), favoriteController.toggleFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Listar todas as criptomoedas favoritas do usuário autenticado
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de moedas favoritas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Criptomoedas listadas' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Favorite' }
 *       401:
 *         description: Não autorizado ou token ausente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
routes.get('/favorites', authMiddleware, favoriteController.listFavorites);

module.exports = routes;