import express from "express";
import EstabelecimentoController from "../controllers/estabelecimentoController.js";

const routes = express.Router();

routes.get("/estabelecimentos", EstabelecimentoController.listarEstabelecimentos);
routes.post("/estabelecimentos", EstabelecimentoController.cadastrarEstabelecimento);
routes.get("/estabelecimentos/:id", EstabelecimentoController.buscarEstabelecimentoPorId);
routes.put("/estabelecimentos/:id", EstabelecimentoController.atualizarEstabelecimento);
routes.delete("/estabelecimentos/:id", EstabelecimentoController.deletarEstabelecimento);

export default routes;
