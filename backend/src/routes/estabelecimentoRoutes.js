import express from "express";
import EstabelecimentoController from "../controllers/estabelecimentoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Estabelecimentos
 *     description: Operações relacionadas à gestão de estabelecimentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Estabelecimento:
 *       type: object
 *       properties:
 *         id_estabelecimento:
 *           type: integer
 *           example: 1
 *         id_criador:
 *           type: integer
 *           example: 10
 *         nome:
 *           type: string
 *           example: "Cantina da Escola ABC"
 *         cnpj:
 *           type: string
 *           example: "12.345.678/0001-99"
 *         endereco:
 *           type: string
 *           example: "Rua das Flores, 123 - Centro"
 *         telefone:
 *           type: string
 *           example: "(11) 99999-1234"
 *         email:
 *           type: string
 *           format: email
 *           example: "contato@cantinaabc.com"
 *         ativo:
 *           type: boolean
 *           example: true
 *         data_adesao:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T12:00:00Z"
 */

/**
 * @swagger
 * /estabelecimentos:
 *   get:
 *     summary: Lista todos os estabelecimentos cadastrados
 *     tags: [Estabelecimentos]
 *     responses:
 *       200:
 *         description: Lista de estabelecimentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estabelecimento'
 *       500:
 *         description: Erro ao listar estabelecimentos
 */
routes.get("/estabelecimentos", authMiddleware, EstabelecimentoController.listarEstabelecimentos);

/**
 * @swagger
 * /estabelecimentos/usuario/{idUsuario}:
 *   get:
 *     summary: Lista os estabelecimentos vinculados a um usuário específico
 *     tags: [Estabelecimentos]
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         description: ID do usuário cujos estabelecimentos serão listados
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de estabelecimentos vinculados ao usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Estabelecimento'
 *                   - type: object
 *                     properties:
 *                       papel:
 *                         type: string
 *                         example: "proprietario"
 *                       data_vinculo:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-06T12:00:00Z"
 *       404:
 *         description: Nenhum estabelecimento encontrado para o usuário
 *       500:
 *         description: Erro ao buscar estabelecimentos do usuário
 */
routes.get("/estabelecimentos/usuario/:idUsuario", authMiddleware, EstabelecimentoController.listarEstabelecimentosDoUsuario);

/**
 * @swagger
 * /estabelecimentos:
 *   post:
 *     summary: Cadastra um novo estabelecimento
 *     tags: [Estabelecimentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estabelecimento'
 *     responses:
 *       201:
 *         description: Estabelecimento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Estabelecimento criado com sucesso! Você já pode gerenciar mensalidades e compras."
 *                 estabelecimento:
 *                   $ref: '#/components/schemas/Estabelecimento'
 *       400:
 *         description: Dados obrigatórios ausentes (id_criador ou nome)
 *       500:
 *         description: Erro ao cadastrar estabelecimento
 */
routes.post("/estabelecimentos", authMiddleware, EstabelecimentoController.cadastrarEstabelecimento);

/**
 * @swagger
 * /estabelecimentos/{id}:
 *   get:
 *     summary: Busca um estabelecimento pelo ID
 *     tags: [Estabelecimentos]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do estabelecimento a ser buscado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estabelecimento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estabelecimento'
 *       404:
 *         description: Estabelecimento não encontrado
 *       500:
 *         description: Erro ao buscar estabelecimento
 */
routes.get("/estabelecimentos/:id", authMiddleware, EstabelecimentoController.buscarEstabelecimentoPorId);

/**
 * @swagger
 * /estabelecimentos/{id}:
 *   put:
 *     summary: Atualiza os dados de um estabelecimento existente
 *     tags: [Estabelecimentos]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do estabelecimento a ser atualizado
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estabelecimento'
 *     responses:
 *       200:
 *         description: Estabelecimento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Estabelecimento atualizado com sucesso"
 *                 estabelecimento:
 *                   $ref: '#/components/schemas/Estabelecimento'
 *       404:
 *         description: Estabelecimento não encontrado
 *       500:
 *         description: Erro ao atualizar estabelecimento
 */
routes.put("/estabelecimentos/:id", authMiddleware, EstabelecimentoController.atualizarEstabelecimento);

/**
 * @swagger
 * /estabelecimentos/{id}:
 *   delete:
 *     summary: Deleta um estabelecimento pelo ID
 *     tags: [Estabelecimentos]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do estabelecimento a ser deletado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estabelecimento deletado com sucesso
 *       404:
 *         description: Estabelecimento não encontrado
 *       500:
 *         description: Erro ao deletar estabelecimento
 */
routes.delete("/estabelecimentos/:id", authMiddleware, EstabelecimentoController.deletarEstabelecimento);

export default routes;
