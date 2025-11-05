import Estabelecimento from "../models/Estabelecimento.js";
import UsuarioEstabelecimento from "../models/UsuarioEstabelecimento.js";

class EstabelecimentoController{

    static async listarEstabelecimentos (req, res){
        try{
            const listaEstabelecimentos = await Estabelecimento.findAll();
            res.status(200).json(listaEstabelecimentos);
        }
        catch(err){
            res.status(500).json({message: `${err.message} - falha na requisicao`});
        }
    }

    static async cadastrarEstabelecimento (req, res){
        try{
            const body = req.body;
            
            // Validação
            if (!body.id_criador || !body.nome) {
                return res.status(400).json({message: `ID do usuário criador e nome são obrigatórios`});
            }

            // Cria o estabelecimento
            const novoEstabelecimento = await Estabelecimento.create(body);
            
            // Vincula o usuário criador como proprietário
            await UsuarioEstabelecimento.create({
                id_usuario: body.id_criador,
                id_estabelecimento: novoEstabelecimento.id_estabelecimento,
                papel: 'proprietario'
            });

            res.status(201).json({ 
                message: "Estabelecimento criado com sucesso! Você já pode gerenciar mensalidades e compras.", 
                estabelecimento: novoEstabelecimento
            });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao cadastrar estabelecimento`});
        }
    }

    static async buscarEstabelecimentoPorId (req, res) {
        try{
            const id = req.params.id;
            const estabelecimento = await Estabelecimento.findByPk(id);
            
            if (!estabelecimento) {
                res.status(404).json({ message: "Estabelecimento não encontrado" });
                return;
            }

            res.status(200).json(estabelecimento);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao buscar estabelecimento`});
        }
    }

    static async atualizarEstabelecimento (req, res) {
        try{
            const id = req.params.id;
            const body = req.body;

            const [updated] = await Estabelecimento.update(body, {
                where: { id_estabelecimento: id }
            });

            if (updated === 0) {
                res.status(404).json({ message: "Estabelecimento não encontrado" });
                return;
            }

            const estabelecimentoAtualizado = await Estabelecimento.findByPk(id);
            res.status(200).json({ message: "Estabelecimento atualizado com sucesso", estabelecimento: estabelecimentoAtualizado });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao atualizar estabelecimento`});
        }
    }

    static async deletarEstabelecimento (req, res) {
        try{
            const id = req.params.id;
            const deleted = await Estabelecimento.destroy({
                where: { id_estabelecimento: id }
            });

            if (deleted === 0) {
                res.status(404).json({ message: "Estabelecimento não encontrado" });
                return;
            }

            res.status(200).json({ message: "Estabelecimento deletado com sucesso" });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao deletar estabelecimento`});
        }
    }

    // Listar estabelecimentos de um usuário específico
    static async listarEstabelecimentosDoUsuario (req, res) {
        try{
            const { idUsuario } = req.params;
            
            const vinculos = await UsuarioEstabelecimento.findAll({
                where: { id_usuario: idUsuario },
                include: [{
                    model: Estabelecimento,
                    as: 'estabelecimento'
                }]
            });

            const estabelecimentos = vinculos.map(v => ({
                ...v.estabelecimento.toJSON(),
                papel: v.papel,
                data_vinculo: v.data_vinculo
            }));

            res.status(200).json(estabelecimentos);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao listar estabelecimentos do usuário`});
        }
    }
}

export default EstabelecimentoController;