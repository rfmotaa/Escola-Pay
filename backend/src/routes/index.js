import express from "express";

import usuario from "./usuarioRoutes.js";
import compra from "../routes/compraRoutes.js";
import estabelecimento from "./estabelecimentoRoutes.js";
import mensalidade from "./mensalidadeRoutes.js";
import pagador from "./pagadorRoutes.js";
import itemCompra from "./itemCompraRoutes.js";

const routes = express.Router()

routes.route("/").get((req, res)=> res.status(200).send("Its home"));
routes.use(express.json(), usuario);
routes.use(express.json(), compra);
routes.use(express.json(), estabelecimento);
routes.use(express.json(), mensalidade);
routes.use(express.json(), pagador);
routes.use(express.json(), itemCompra);

export default routes;