import express from "express";
import MensalidadeController from "../controllers/mensalidadeController.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Mensalidades
 *     description: Operações relacionadas à gestão de mensalidades dos pagadores e estabelecimentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Mensalidade:
 *       type: object
 *       properties:
 *         id_mensalidade:
 *           type: integer
 *           example: 1
 *         id_estabelecimento:
 *           type: integer
 *           description: ID do estabelecimento ao qual a mensalidade pertence
 *           example: 5
 *         id_pagador:
 *           type: integer
 *           description: ID do pagador responsável pela mensalidade
 *           example: 12
 *         valor:
 *           type: number
 *           format: float
 *           example: 250.00
 *         data_vencimento:
 *           type: string
 *           format: date
 *           example: "2025-12-10"
 *         data_pagamento:
 *           type: string
 *           format: date
 *           example: "2025-12-08"
 *         status:
 *           type: string
 *           enum: [pendente, pago, atrasado, cancelado]
 *           example: "pago"
 *         descricao:
 *           type: string
 *           example: "Mensalidade referente ao mês de dezembro"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T11:00:00Z"
 */

/**
 * @swagger
 * /mensalidades:
 *   get:
 *     summary: Lista todas as mensalidades cadastradas
 *     tags: [Mensalidades]
 *     responses:
 *       200:
 *         description: Lista de mensalidades retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mensalidade'
 *       500:
 *         description: Erro ao listar mensalidades
 */
routes.get("/mensalidades", MensalidadeController.listarMensalidades);

/**
 * @swagger
 * /mensalidades:
 *   post:
 *     summary: Cadastra uma nova mensalidade
 *     tags: [Mensalidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mensalidade'
 *     responses:
 *       200:
 *         description: Mensalidade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mensalidade criada com sucesso"
 *                 mensalidade:
 *                   $ref: '#/components/schemas/Mensalidade'
 *       400:
 *         description: Dados obrigatórios ausentes ou inválidos
 *       500:
 *         description: Erro ao cadastrar mensalidade
 */
routes.post("/mensalidades", MensalidadeController.cadastrarMensalidade);

/**
 * @swagger
 * /mensalidades/{id}:
 *   get:
 *     summary: Busca uma mensalidade pelo ID
 *     tags: [Mensalidades]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da mensalidade a ser buscada
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mensalidade encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensalidade'
 *       404:
 *         description: Mensalidade não encontrada
 *       500:
 *         description: Erro ao buscar mensalidade
 */
routes.get("/mensalidades/:id", MensalidadeController.buscarMensalidadePorId);

/**
 * @swagger
 * /mensalidades/{id}:
 *   put:
 *     summary: Atualiza os dados de uma mensalidade existente
 *     tags: [Mensalidades]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da mensalidade a ser atualizada
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mensalidade'
 *     responses:
 *       200:
 *         description: Mensalidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mensalidade atualizada com sucesso"
 *                 mensalidade:
 *                   $ref: '#/components/schemas/Mensalidade'
 *       404:
 *         description: Mensalidade não encontrada
 *       500:
 *         description: Erro ao atualizar mensalidade
 */
routes.put("/mensalidades/:id", MensalidadeController.atualizarMensalidade);

/**
 * @swagger
 * /mensalidades/{id}:
 *   delete:
 *     summary: Deleta uma mensalidade pelo ID
 *     tags: [Mensalidades]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da mensalidade a ser deletada
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mensalidade deletada com sucesso
 *       404:
 *         description: Mensalidade não encontrada
 *       500:
 *         description: Erro ao deletar mensalidade
 */
routes.delete("/mensalidades/:id", MensalidadeController.deletarMensalidade);

export default routes;
