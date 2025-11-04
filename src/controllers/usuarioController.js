import Usuario from "../models/Usuario.js";

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
            const novoUsuario = await Usuario.create(req.body);
            res.status(200).json({ message:"usuario criado com sucesso", usuario: novoUsuario});
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao cadastrar usuario`});
        }
    }
}

export default UsuarioController;