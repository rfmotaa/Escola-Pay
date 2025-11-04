//id_estabelecimento, nome, email, senha, ativo, data_cadastro

import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_estabelecimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'estabelecimentos',
            key: 'id_estabelecimento'
        }
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    data_cadastro: {
            type: DataTypes.DATE,
            allowNull: false
    }
}, {
    tableName: 'usuarios',
    timestamps: true

});

export default Usuario;