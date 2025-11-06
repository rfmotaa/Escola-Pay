import express from "express";
import CompraController from "../controllers/compraController.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Compras
 *     description: Operações relacionadas às compras
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Compra:
 *       type: object
 *       properties:
 *         id_compra:
 *           type: integer
 *           example: 1
 *         id_estabelecimento:
 *           type: integer
 *           example: 10
 *         id_usuario_responsavel:
 *           type: integer
 *           example: 5
 *         item:
 *           type: string
 *           example: "Notebook Lenovo"
 *         valor_unitario:
 *           type: number
 *           format: float
 *           example: 4500.00
 *         valor_total:
 *           type: number
 *           format: float
 *           example: 9000.00
 *         data_compra:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T10:00:00Z"
 *         descricao:
 *           type: string
 *           example: "Compra de equipamentos de TI"
 */

/**
 * @swagger
 * /compras:
 *   get:
 *     summary: Lista todas as compras
 *     tags: [Compras]
 *     responses:
 *       200:
 *         description: Lista de compras retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Compra'
 *       500:
 *         description: Erro ao listar compras
 */
routes.get("/compras", CompraController.listarCompras);

/**
 * @swagger
 * /compras:
 *   post:
 *     summary: Cadastra uma nova compra
 *     tags: [Compras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Compra'
 *     responses:
 *       201:
 *         description: Compra criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Compra'
 *       500:
 *         description: Erro ao cadastrar compra
 */
routes.post("/compras", CompraController.cadastrarCompra);

/**
 * @swagger
 * /compras/{id}:
 *   get:
 *     summary: Busca uma compra pelo ID
 *     tags: [Compras]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da compra a ser buscada
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compra encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Compra'
 *       404:
 *         description: Compra não encontrada
 *       500:
 *         description: Erro ao buscar compra
 */
routes.get("/compras/:id", CompraController.buscarCompraPorId);

/**
 * @swagger
 * /compras/{id}:
 *   put:
 *     summary: Atualiza uma compra existente
 *     tags: [Compras]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da compra a ser atualizada
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Compra'
 *     responses:
 *       200:
 *         description: Compra atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Compra'
 *       404:
 *         description: Compra não encontrada
 *       500:
 *         description: Erro ao atualizar compra
 */
routes.put("/compras/:id", CompraController.atualizarCompra);

/**
 * @swagger
 * /compras/{id}:
 *   delete:
 *     summary: Deleta uma compra pelo ID
 *     tags: [Compras]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da compra a ser deletada
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compra deletada com sucesso
 *       404:
 *         description: Compra não encontrada
 *       500:
 *         description: Erro ao deletar compra
 */
routes.delete("/compras/:id", CompraController.deletarCompra);

export default routes;