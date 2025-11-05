import Usuario from "../models/Usuario.js";
import { validate } from "../plugins/schemaValidator.js";
import { CryptoManager } from "../config/crypto.js";

class UsuarioController{

    static async listarUsuarios (req, res){
        try{
            const listaUsuarios = await Usuario.findAll();
            res.status(200).json(listaUsuarios);
        }
        catch{
            res.status(500).json({message: `${err.message} = falha na requisicao`});
        }
    }

    static async cadastrarUsuario (req, res){
        try{
            const body = req.body;
            if (!validate(body))
                res.status(401).json({message: `Informações incorretas no body`});

            body.senha = CryptoManager.generateHash(body.senha);

            const novoUsuario = await Usuario.create(body);
            res.status(200).json({ message:"usuario criado com sucesso", usuario: novoUsuario});
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao cadastrar usuario`});
        }
    }

    static async login (req, res) {
        try{
            const { email, senha } = req.body;
            const usuario = await Usuario.findOne({ email });
            if (!usuario) throw Error("Usuário não encontrado!");

            if (!CryptoManager.compareHash(senha, usuario.senha))
                throw Error("A senha está incorreta!");

            res.status(200).json({ message:"usuario logado com sucesso"});
        }
        catch(erro){
            res.status(500).json({message: `${erro.message}`});
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
                body.senha = CryptoManager.generateHash(body.senha);
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