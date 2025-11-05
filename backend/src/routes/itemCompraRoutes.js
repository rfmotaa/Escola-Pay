import express from "express";
import ItemCompraController from "../controllers/itemCompraController.js";

const routes = express.Router();

routes.get("/itens-compra", ItemCompraController.listarItensCompra);
routes.post("/itens-compra", ItemCompraController.cadastrarItemCompra);
routes.get("/itens-compra/:id", ItemCompraController.buscarItemCompraPorId);
routes.put("/itens-compra/:id", ItemCompraController.atualizarItemCompra);
routes.delete("/itens-compra/:id", ItemCompraController.deletarItemCompra);

export default routes;
