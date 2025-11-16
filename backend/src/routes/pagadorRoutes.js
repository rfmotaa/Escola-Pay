import express from "express";
import PagadorController from "../controllers/pagadorController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Pagadores
 *     description: Operações relacionadas à gestão de pagadores vinculados aos estabelecimentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pagador:
 *       type: object
 *       properties:
 *         id_pagador:
 *           type: integer
 *           example: 1
 *         id_estabelecimento:
 *           type: integer
 *           description: ID do estabelecimento ao qual o pagador está vinculado
 *           example: 10
 *         nome:
 *           type: string
 *           example: "Maria Oliveira"
 *         telefone:
 *           type: string
 *           example: "(11) 98888-7777"
 *         data_cadastro:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T12:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T12:05:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T12:10:00Z"
 */

/**
 * @swagger
 * /pagadores:
 *   get:
 *     summary: Lista todos os pagadores cadastrados
 *     tags: [Pagadores]
 *     responses:
 *       200:
 *         description: Lista de pagadores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pagador'
 *       500:
 *         description: Erro ao listar pagadores
 */
routes.get("/pagadores", authMiddleware, PagadorController.listarPagadores);

/**
 * @swagger
 * /pagadores:
 *   post:
 *     summary: Cadastra um novo pagador
 *     tags: [Pagadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pagador'
 *     responses:
 *       200:
 *         description: Pagador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pagador criado com sucesso"
 *                 pagador:
 *                   $ref: '#/components/schemas/Pagador'
 *       400:
 *         description: Dados obrigatórios ausentes ou inválidos
 *       500:
 *         description: Erro ao cadastrar pagador
 */
routes.post("/pagadores", authMiddleware, PagadorController.cadastrarPagador);

/**
 * @swagger
 * /pagadores/{id}:
 *   get:
 *     summary: Busca um pagador pelo ID
 *     tags: [Pagadores]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do pagador a ser buscado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pagador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pagador'
 *       404:
 *         description: Pagador não encontrado
 *       500:
 *         description: Erro ao buscar pagador
 */
routes.get("/pagadores/:id", authMiddleware, PagadorController.buscarPagadorPorId);

/**
 * @swagger
 * /pagadores/{id}:
 *   put:
 *     summary: Atualiza os dados de um pagador existente
 *     tags: [Pagadores]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do pagador a ser atualizado
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pagador'
 *     responses:
 *       200:
 *         description: Pagador atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pagador atualizado com sucesso"
 *                 pagador:
 *                   $ref: '#/components/schemas/Pagador'
 *       404:
 *         description: Pagador não encontrado
 *       500:
 *         description: Erro ao atualizar pagador
 */
routes.put("/pagadores/:id", authMiddleware, PagadorController.atualizarPagador);

/**
 * @swagger
 * /pagadores/{id}:
 *   delete:
 *     summary: Deleta um pagador pelo ID
 *     tags: [Pagadores]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do pagador a ser deletado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pagador deletado com sucesso
 *       404:
 *         description: Pagador não encontrado
 *       500:
 *         description: Erro ao deletar pagador
 */
routes.delete("/pagadores/:id", authMiddleware, PagadorController.deletarPagador);

export default routes;