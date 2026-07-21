const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { registerSchema, loginSchema, updateProfileSchema } = require('../validations/auth.schema');

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints para autenticação institucioal e gerenciamento de sessão (JWT + Redis Blacklist)
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastrar um novo usuário no sistema
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, confirmPassword]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Caio Venancio
 *               email:
 *                 type: string
 *                 format: email
 *                 example: caio@empresa.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário criado e logado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Usuário registrado com sucesso' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
 *                     user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Email já registrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       422:
 *         description: Falha de validação nos campos (Zod)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
routes.post('/register', validate(registerSchema), authController.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar na conta com e-mail e senha
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: caio@empresa.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso e token JWT emitido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Login realizado com sucesso' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
 *                     user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
routes.post('/login', validate(loginSchema), authController.loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Encerrar sessão e adicionar token JWT à blacklist do Redis
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessão encerrada com sucesso
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       401:
 *         description: Não autorizado ou token já revogado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
routes.post('/logout', authController.logoutUser);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Atualizar perfil (nome, email e senha opcional)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Caio Venancio" }
 *               email: { type: string, format: email, example: "caio@empresa.com" }
 *               password: { type: string, format: password, example: "nova_senha123" }
 *               confirmPassword: { type: string, format: password, example: "nova_senha123" }
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Erro de validação ou email já em uso
 *       401:
 *         description: Não autorizado
 */
routes.put('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obter dados do usuário autenticado pela sessão ou token/cookie
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *       401:
 *         description: Não autorizado / Sem sessão ativa
 */
routes.get('/me', authMiddleware, authController.getMe);

module.exports = routes;