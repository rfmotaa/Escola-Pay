import express from "express";
import UsuarioController from "../controllers/usuarioController.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Operações relacionadas à criação e gerenciamento de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: "João da Silva"
 *         email:
 *           type: string
 *           example: "joao.silva@gmail.com"
 *         telefone:
 *           type: string
 *           example: "(11) 99999-9999"
 *         ativo:
 *           type: boolean
 *           example: true
 *         data_cadastro:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T12:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T12:10:00Z"
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários cadastrados
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro ao listar usuários
 */
routes.get("/usuarios", UsuarioController.listarUsuarios);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João da Silva"
 *               email:
 *                 type: string
 *                 example: "joao.silva@gmail.com"
 *               senha:
 *                 type: string
 *                 example: "minhaSenhaSegura123"
 *               telefone:
 *                 type: string
 *                 example: "(11) 99999-9999"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário criado com sucesso! Agora você pode criar seu estabelecimento."
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Campos obrigatórios ausentes
 *       500:
 *         description: Erro ao cadastrar usuário
 */
routes.post("/usuarios", UsuarioController.cadastrarUsuario);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: "joao.silva@gmail.com"
 *               senha:
 *                 type: string
 *                 example: "minhaSenhaSegura123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário logado com sucesso"
 *       401:
 *         description: Credenciais inválidas
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao efetuar login
 */
routes.post("/usuarios/login", UsuarioController.login);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuário
 */
routes.get("/usuarios/:id", UsuarioController.buscarUsuarioPorId);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário a ser atualizado
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João da Silva"
 *               telefone:
 *                 type: string
 *                 example: "(11) 91234-5678"
 *               senha:
 *                 type: string
 *                 example: "novaSenha123"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar usuário
 */
routes.put("/usuarios/:id", UsuarioController.atualizarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao deletar usuário
 */
routes.delete("/usuarios/:id", UsuarioController.deletarUsuario);

export default routes;