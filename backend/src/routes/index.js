import express from "express";

import usuario from "./usuarioRoutes.js";
import compra from "../routes/compraRoutes.js";
import estabelecimento from "./estabelecimentoRoutes.js";
import mensalidade from "./mensalidadeRoutes.js";
import pagador from "./pagadorRoutes.js";
import itemCompra from "./itemCompraRoutes.js";

const routes = express.Router();

routes.route("/").get((req, res) => res.status(200).send("Its home"));

// express.json() is already applied globally in server.js
routes.use(usuario);
routes.use(compra);
routes.use(estabelecimento);
routes.use(mensalidade);
routes.use(pagador);
routes.use(itemCompra);

export default routes;