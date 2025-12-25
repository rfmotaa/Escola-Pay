import Compra from "../models/Compra.js";
import { Op } from "sequelize";

class CompraController{

    static async listarCompras (req, res){
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
                
                whereClause.data_compra = {
                    [Op.between]: [dataInicio, dataFim]
                };
            }
            
            const listaCompras = await Compra.findAll({
                where: whereClause,
                order: [['data_compra', 'DESC']]
            });
            res.status(200).json(listaCompras);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao listar compras`});
        }
    }

    static async cadastrarCompra (req, res){
        try{
            const body = req.body;
            const novaCompra = await Compra.create(body);
            res.status(201).json({ message: "Compra criada com sucesso", compra: novaCompra });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao cadastrar compra`});
        }
    }

    static async buscarCompraPorId (req, res) {
        try{
            const id = req.params.id;
            const compra = await Compra.findByPk(id);
            
            if (!compra) {
                res.status(404).json({ message: "Compra não encontrada" });
                return;
            }

            res.status(200).json(compra);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao buscar compra`});
        }
    }

    static async atualizarCompra (req, res) {
        try{
            const id = req.params.id;
            const body = req.body;

            const [updated] = await Compra.update(body, {
                where: { id_compra: id }
            });

            if (updated === 0) {
                res.status(404).json({ message: "Compra não encontrada" });
                return;
            }

            const compraAtualizada = await Compra.findByPk(id);
            res.status(200).json({ message: "Compra atualizada com sucesso", compra: compraAtualizada });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao atualizar compra`});
        }
    }

    static async deletarCompra (req, res) {
        try{
            const id = req.params.id;
            const deleted = await Compra.destroy({
                where: { id_compra: id }
            });

            if (deleted === 0) {
                res.status(404).json({ message: "Compra não encontrada" });
                return;
            }

            res.status(200).json({ message: "Compra deletada com sucesso" });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao deletar compra`});
        }
    }
}

export default CompraController;