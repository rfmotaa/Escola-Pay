import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname,'../../database.sqlite'),
    logging: false
});

async function conectarBanco() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com SQLite estabelecida!');
        
        await sequelize.sync({ force: true });
        console.log('✅ Tabelas sincronizadas!');
        
        return sequelize;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
        throw error;
    }
}

export { sequelize, conectarBanco };