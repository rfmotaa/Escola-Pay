import express from "express";
import usuario from "./usuarioRoutes.js";
import compra from "../routes/compraRoutes.js";
import estabelecimento from "./estabelecimentoRoutes.js";
import mensalidade from "./mensalidadeRoutes.js";
import pagador from "./pagadorRoutes.js";
import itemCompra from "./itemCompraRoutes.js";

const routes = (app)=>{
    app.route("/").get((req, res)=> res.status(200).send("Its home"));
    app.use(express.json(), usuario);
    app.use(express.json(), compra);
    app.use(express.json(), estabelecimento);
    app.use(express.json(), mensalidade);
    app.use(express.json(), pagador);
    app.use(express.json(), itemCompra);
};

export default routes;