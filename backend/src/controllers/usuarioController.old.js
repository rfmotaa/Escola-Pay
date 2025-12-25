import Usuario from "../models/Usuario.js";
import { CryptoManager } from "../config/crypto.js";
import jwt from "jsonwebtoken";

class UsuarioController{

    static async listarUsuarios (req, res){
        try{
            const listaUsuarios = await Usuario.findAll();
            res.status(200).json(listaUsuarios);
        }
        catch(err){
            res.status(500).json({message: `${err.message} - falha na requisicao`});
        }
    }

    static async cadastrarUsuario (req, res){
        try{
            const body = req.body;
            
            if (!body.nome || !body.email || !body.senha) {
                return res.status(400).json({message: "Nome, email e senha são obrigatórios"});
            }

            if (body.telefone === '') {
                delete body.telefone;
            }

            body.senha = await CryptoManager.generateHash(body.senha);

            const novoUsuario = await Usuario.create(body);
            
            const usuarioResposta = {
                id_usuario: novoUsuario.id_usuario,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                telefone: novoUsuario.telefone,
                ativo: novoUsuario.ativo,
                data_cadastro: novoUsuario.data_cadastro
            };

            res.status(201).json({ 
                message: "Usuário criado com sucesso! Agora você pode criar seu estabelecimento.", 
                usuario: usuarioResposta
            });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao cadastrar usuario`});
        }
    }

    static async login (req, res) {
        try{
            const { email, senha } = req.body;
            const usuario = await Usuario.findOne({ where: { email } });
            
            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            const senhaValida = await CryptoManager.compareHash(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: "Senha incorreta" });
            }

            const token = jwt.sign(
                { 
                    id_usuario: usuario.id_usuario,
                    email: usuario.email,
                    nome: usuario.nome 
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.status(200).json({ 
                message: "Usuário logado com sucesso",
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nome: usuario.nome,
                    email: usuario.email
                }
            });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao efetuar login`});
        }
    }

    static async buscarUsuarioPorId (req, res) {
        try{
            const id = req.params.id;
            const usuario = await Usuario.findByPk(id);
            
            if (!usuario) {
                res.status(404).json({ message: "Usuário não encontrado" });
                return;
            }

            res.status(200).json(usuario);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao buscar usuario`});
        }
    }

    static async atualizarUsuario (req, res) {
        try{
            const id = req.params.id;
            const body = req.body;

            if (body.senha) {
                body.senha = await CryptoManager.generateHash(body.senha);
            }

            const [updated] = await Usuario.update(body, {
                where: { id_usuario: id }
            });

            if (updated === 0) {
                res.status(404).json({ message: "Usuário não encontrado" });
                return;
            }

            const usuarioAtualizado = await Usuario.findByPk(id);
            res.status(200).json({ message: "Usuario atualizado com sucesso", usuario: usuarioAtualizado });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao atualizar usuario`});
        }
    }

    static async deletarUsuario (req, res) {
        try{
            const id = req.params.id;
            const deleted = await Usuario.destroy({
                where: { id_usuario: id }
            });

            if (deleted === 0) {
                res.status(404).json({ message: "Usuário não encontrado" });
                return;
            }

            res.status(200).json({ message: "Usuario deletado com sucesso" });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao deletar usuario`});
        }
    }
}

export default UsuarioController;