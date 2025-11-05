import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Pagador = sequelize.define('Pagador', {
    id_pagador: {
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
    telefone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    data_cadastro: {
            type: DataTypes.DATE,
            allowNull: false
    }
    
}, {
    tableName: 'pagadores',
    timestamps: true
});

export default Pagador;