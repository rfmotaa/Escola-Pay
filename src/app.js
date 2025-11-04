import express from "express";
import { conectarBanco } from "./config/database.js";
import routes from "./routes/index.js"
import "./models/index.js";


await conectarBanco();

const app = express();
app.use(express.json());

routes(app);

export default app;