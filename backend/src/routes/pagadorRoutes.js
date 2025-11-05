import express from "express";
import PagadorController from "../controllers/pagadorController.js";

const routes = express.Router();

routes.get("/pagadores", PagadorController.listarPagadores);
routes.post("/pagadores", PagadorController.cadastrarPagador);
routes.get("/pagadores/:id", PagadorController.buscarPagadorPorId);
routes.put("/pagadores/:id", PagadorController.atualizarPagador);
routes.delete("/pagadores/:id", PagadorController.deletarPagador);

export default routes;
