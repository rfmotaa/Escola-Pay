import express from "express";
import ItemCompraController from "../controllers/itemCompraController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Itens de Compra
 *     description: Operações relacionadas à gestão dos itens das compras
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemCompra:
 *       type: object
 *       properties:
 *         id_item_compra:
 *           type: integer
 *           example: 1
 *         id_compra:
 *           type: integer
 *           description: ID da compra à qual o item pertence
 *           example: 10
 *         nome_produto:
 *           type: string
 *           example: "Suco de Laranja 1L"
 *         quantidade:
 *           type: integer
 *           example: 3
 *         valor_unitario:
 *           type: number
 *           format: float
 *           example: 5.50
 *         valor_total:
 *           type: number
 *           format: float
 *           example: 16.50
 *         categoria:
 *           type: string
 *           example: "Bebidas"
 *         observacao:
 *           type: string
 *           example: "Produto entregue parcialmente, falta 1 unidade"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T12:30:00Z"
 */

/**
 * @swagger
 * /itens-compra:
 *   get:
 *     summary: Lista todos os itens de compra cadastrados
 *     tags: [Itens de Compra]
 *     responses:
 *       200:
 *         description: Lista de itens de compra retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemCompra'
 *       500:
 *         description: Erro ao listar itens de compra
 */
routes.get("/itens-compra", authMiddleware, ItemCompraController.listarItensCompra);

/**
 * @swagger
 * /itens-compra:
 *   post:
 *     summary: Cadastra um novo item de compra
 *     tags: [Itens de Compra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemCompra'
 *     responses:
 *       200:
 *         description: Item de compra criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item de compra criado com sucesso"
 *                 itemCompra:
 *                   $ref: '#/components/schemas/ItemCompra'
 *       400:
 *         description: Dados obrigatórios ausentes ou inválidos
 *       500:
 *         description: Erro ao cadastrar item de compra
 */
routes.post("/itens-compra", authMiddleware, ItemCompraController.cadastrarItemCompra);

/**
 * @swagger
 * /itens-compra/{id}:
 *   get:
 *     summary: Busca um item de compra pelo ID
 *     tags: [Itens de Compra]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do item de compra a ser buscado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item de compra encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemCompra'
 *       404:
 *         description: Item de compra não encontrado
 *       500:
 *         description: Erro ao buscar item de compra
 */
routes.get("/itens-compra/:id", authMiddleware, ItemCompraController.buscarItemCompraPorId);

/**
 * @swagger
 * /itens-compra/{id}:
 *   put:
 *     summary: Atualiza os dados de um item de compra existente
 *     tags: [Itens de Compra]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do item de compra a ser atualizado
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemCompra'
 *     responses:
 *       200:
 *         description: Item de compra atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item de compra atualizado com sucesso"
 *                 itemCompra:
 *                   $ref: '#/components/schemas/ItemCompra'
 *       404:
 *         description: Item de compra não encontrado
 *       500:
 *         description: Erro ao atualizar item de compra
 */
routes.put("/itens-compra/:id", authMiddleware, ItemCompraController.atualizarItemCompra);

/**
 * @swagger
 * /itens-compra/{id}:
 *   delete:
 *     summary: Deleta um item de compra pelo ID
 *     tags: [Itens de Compra]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do item de compra a ser deletado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item de compra deletado com sucesso
 *       404:
 *         description: Item de compra não encontrado
 *       500:
 *         description: Erro ao deletar item de compra
 */
routes.delete("/itens-compra/:id", authMiddleware, ItemCompraController.deletarItemCompra);

export default routes;