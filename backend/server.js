import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.config.js';
import routes from './src/routes/index.js'

import { conectarBanco } from './src/config/database.js';
import { verifySalt } from './src/config/crypto.js';
import { popularBanco } from './src/config/seedDatabase.js';
import './src/models/index.js';

dotenv.config();

const PORT  = process.env.PORT || 3000;

await verifySalt();
await conectarBanco();
await popularBanco();

const app = express();

app.use(cors()); 
app.use(express.json());

app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => {
	res.status(200).json({ 
		message: 'Bem-vindo à API SchoolManager!',
		docs: '/api-docs' 
	});
});

app.listen(PORT,  ()=>{
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 Documentação da API disponível em http://localhost:${PORT}/api-docs`);
});