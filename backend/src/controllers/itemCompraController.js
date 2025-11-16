import ItemCompra from "../models/ItemCompra.js";

class ItemCompraController{

    static async listarItensCompra (req, res){
        try{
            const listaItensCompra = await ItemCompra.findAll();
            res.status(200).json(listaItensCompra);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao listar itens de compra`});
        }
    }

    static async cadastrarItemCompra (req, res){
        try{
            const body = req.body;
            const novoItemCompra = await ItemCompra.create(body);
            res.status(201).json({ message: "Item de compra criado com sucesso", itemCompra: novoItemCompra });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao cadastrar item de compra`});
        }
    }

    static async buscarItemCompraPorId (req, res) {
        try{
            const id = req.params.id;
            const itemCompra = await ItemCompra.findByPk(id);
            
            if (!itemCompra) {
                res.status(404).json({ message: "Item de compra não encontrado" });
                return;
            }

            res.status(200).json(itemCompra);
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao buscar item de compra`});
        }
    }

    static async atualizarItemCompra (req, res) {
        try{
            const id = req.params.id;
            const body = req.body;

            const [updated] = await ItemCompra.update(body, {
                where: { id_item_compra: id }
            });

            if (updated === 0) {
                res.status(404).json({ message: "Item de compra não encontrado" });
                return;
            }

            const itemCompraAtualizado = await ItemCompra.findByPk(id);
            res.status(200).json({ message: "Item de compra atualizado com sucesso", itemCompra: itemCompraAtualizado });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao atualizar item de compra`});
        }
    }

    static async deletarItemCompra (req, res) {
        try{
            const id = req.params.id;
            const deleted = await ItemCompra.destroy({
                where: { id_item_compra: id }
            });

            if (deleted === 0) {
                res.status(404).json({ message: "Item de compra não encontrado" });
                return;
            }

            res.status(200).json({ message: "Item de compra deletado com sucesso" });
        }
        catch(erro){
            res.status(500).json({message: `${erro.message} - falha ao deletar item de compra`});
        }
    }
}

export default ItemCompraController;
