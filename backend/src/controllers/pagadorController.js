import Pagador from "../models/Pagador.js";

class PagadorController{

    static async listarPagadores (req, res){
        try{
            const listaPagadores = await Pagador.findAll();
            res.status(200).json(listaPagadores);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao listar pagadores`});
        }
    }

    static async cadastrarPagador (req, res){
        try{
            const body = req.body;
            const novoPagador = await Pagador.create(body);
            res.status(201).json({ message: "Pagador criado com sucesso", pagador: novoPagador });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao cadastrar pagador`});
        }
    }

    static async buscarPagadorPorId (req, res) {
        try{
            const id = req.params.id;
            const pagador = await Pagador.findByPk(id);
            
            if (!pagador) {
                res.status(404).json({ message: "Pagador não encontrado" });
                return;
            }

            res.status(200).json(pagador);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao buscar pagador`});
        }
    }

    static async atualizarPagador (req, res) {
        try{
            const id = req.params.id;
            const body = req.body;

            const [updated] = await Pagador.update(body, {
                where: { id_pagador: id }
            });

            if (updated === 0) {
                res.status(404).json({ message: "Pagador não encontrado" });
                return;
            }

            const pagadorAtualizado = await Pagador.findByPk(id);
            res.status(200).json({ message: "Pagador atualizado com sucesso", pagador: pagadorAtualizado });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao atualizar pagador`});
        }
    }

    static async deletarPagador (req, res) {
        try{
            const id = req.params.id;
            const deleted = await Pagador.destroy({
                where: { id_pagador: id }
            });

            if (deleted === 0) {
                res.status(404).json({ message: "Pagador não encontrado" });
                return;
            }

            res.status(200).json({ message: "Pagador deletado com sucesso" });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao deletar pagador`});
        }
    }
}

export default PagadorController;
