import Mensalidade from "../models/Mensalidade.js";
import { Op } from "sequelize";

class MensalidadeController{

    static async listarMensalidades (req, res){
        try{
            const { id_estabelecimento, mes, ano } = req.query;
            
            let whereClause = {};
            
            // Filtrar por estabelecimento se fornecido
            if (id_estabelecimento) {
                whereClause.id_estabelecimento = id_estabelecimento;
            }
            
            // Filtrar por mês/ano se fornecidos
            if (mes && ano) {
                const mesNum = parseInt(mes);
                const anoNum = parseInt(ano);
                const dataInicio = new Date(anoNum, mesNum - 1, 1);
                const dataFim = new Date(anoNum, mesNum, 0);
                
                whereClause.data_vencimento = {
                    [Op.between]: [dataInicio, dataFim]
                };
            }
            
            const listaMensalidades = await Mensalidade.findAll({
                where: whereClause,
                order: [['data_vencimento', 'DESC']]
            });
            res.status(200).json(listaMensalidades);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao listar mensalidades`});
        }
    }

    static async cadastrarMensalidade (req, res){
        try{
            const body = req.body;
            const novaMensalidade = await Mensalidade.create(body);
            res.status(201).json({ message: "Mensalidade criada com sucesso", mensalidade: novaMensalidade });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao cadastrar mensalidade`});
        }
    }

    static async buscarMensalidadePorId (req, res) {
        try{
            const id = req.params.id;
            const mensalidade = await Mensalidade.findByPk(id);
            
            if (!mensalidade) {
                res.status(404).json({ message: "Mensalidade não encontrada" });
                return;
            }

            res.status(200).json(mensalidade);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao buscar mensalidade`});
        }
    }

    static async atualizarMensalidade (req, res) {
        try{
            const id = req.params.id;
            const body = req.body;

            const [updated] = await Mensalidade.update(body, {
                where: { id_mensalidade: id }
            });

            if (updated === 0) {
                res.status(404).json({ message: "Mensalidade não encontrada" });
                return;
            }

            const mensalidadeAtualizada = await Mensalidade.findByPk(id);
            res.status(200).json({ message: "Mensalidade atualizada com sucesso", mensalidade: mensalidadeAtualizada });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao atualizar mensalidade`});
        }
    }

    static async deletarMensalidade (req, res) {
        try{
            const id = req.params.id;
            const deleted = await Mensalidade.destroy({
                where: { id_mensalidade: id }
            });

            if (deleted === 0) {
                res.status(404).json({ message: "Mensalidade não encontrada" });
                return;
            }

            res.status(200).json({ message: "Mensalidade deletada com sucesso" });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao deletar mensalidade`});
        }
    }
}

export default MensalidadeController;
