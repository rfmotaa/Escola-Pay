import express from "express";
import usuario from "./usuarioRoutes.js";
import compra from "../routes/compraRoutes.js";
import estabelecimento from "./estabelecimentoRoutes.js";

const routes = (app)=>{
    app.route("/").get((req, res)=> res.status(200).send("Its home"));
    app.use(express.json(), usuario);
    app.use(express.json(), compra);
    app.use(express.json(), estabelecimento);
};

export default routes;