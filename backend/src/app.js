import express from "express";
import morgan from "morgan";
import { conectarBanco } from "./config/database.js";
import { verifySalt } from "./config/crypto.js";
import routes from "./routes/index.js"
import "./models/index.js";

verifySalt();
await conectarBanco();

const app = express();

app.use(morgan('dev'));
app.use(express.json());

routes(app);

export default app;