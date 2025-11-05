import express from "express";
import UsuarioController from "../controllers/usuarioController.js";

const routes = express.Router();

routes.get("/usuarios", UsuarioController.listarUsuarios);
routes.post("/usuarios", UsuarioController.cadastrarUsuario);
routes.get("/usuarios/{id}", UsuarioController.buscarUsuarioPorId);
routes.put("/usuarios/{id}", UsuarioController.atualizarUsuario);
routes.delete("/usuarios/{id}", UsuarioController.deletarUsuario);

export default routes;