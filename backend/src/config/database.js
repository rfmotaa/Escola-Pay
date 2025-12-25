import { Sequelize } from "sequelize";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
});

async function conectarBanco() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com SQLite estabelecida!');
        
        // Check if database file exists (fresh start vs existing)
        const isNewDatabase = !fs.existsSync(dbPath) || fs.statSync(dbPath).size === 0;
        
        if (isNewDatabase) {
            // Fresh database - create all tables
            await sequelize.sync();
            console.log('✅ Tabelas criadas!');
        } else {
            // Existing database - sync without altering (SQLite has ALTER limitations)
            // For schema changes in production, use migrations
            await sequelize.sync();
            console.log('✅ Tabelas sincronizadas!');
        }
        
        return sequelize;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
        throw error;
    }
}

export { sequelize, conectarBanco };