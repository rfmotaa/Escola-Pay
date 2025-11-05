import express from "express";
import CompraController from "../controllers/compraController.js";

const routes = express.Router();

routes.get("/compras", CompraController.listarCompras);
routes.post("/compras", CompraController.cadastrarCompra);
routes.get("/compras/:id", CompraController.buscarCompraPorId);
routes.put("/compras/:id", CompraController.atualizarCompra);
routes.delete("/compras/:id", CompraController.deletarCompra);

export default routes;