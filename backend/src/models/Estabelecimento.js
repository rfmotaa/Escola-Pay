//Estabelecimento criado por um usuário
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Estabelecimento = sequelize.define("Estabelecimento", {
    id_estabelecimento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_criador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
        }
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING(18),
        allowNull: true, // Opcional - pode ser MEI ou não ter
        unique: true
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    data_adesao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

},{
    tableName: 'estabelecimentos',
    timestamps: true
});

export default Estabelecimento;