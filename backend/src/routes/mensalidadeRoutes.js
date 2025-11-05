import express from "express";
import MensalidadeController from "../controllers/mensalidadeController.js";

const routes = express.Router();

routes.get("/mensalidades", MensalidadeController.listarMensalidades);
routes.post("/mensalidades", MensalidadeController.cadastrarMensalidade);
routes.get("/mensalidades/:id", MensalidadeController.buscarMensalidadePorId);
routes.put("/mensalidades/:id", MensalidadeController.atualizarMensalidade);
routes.delete("/mensalidades/:id", MensalidadeController.deletarMensalidade);

export default routes;
