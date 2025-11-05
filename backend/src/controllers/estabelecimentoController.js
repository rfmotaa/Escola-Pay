import Estabelecimento from "../models/Estabelecimento.js";

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
            const novoEstabelecimento = await Estabelecimento.create(body);
            res.status(200).json({ message:"estabelecimento criado com sucesso", estabelecimento: novoEstabelecimento});
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
}

export default EstabelecimentoController;