import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Mensalidade = sequelize.define('Mensalidade', {
    id_mensalidade: {
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
    id_pagador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pagadores',
            key: 'id_pagador'
        }
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    data_vencimento: {
        type: DataTypes.DATEONLY, // Apenas data, sem hora
        allowNull: false
    },
    data_pagamento: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pendente', 'pago', 'atrasado', 'cancelado'),
        defaultValue: 'pendente'
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'mensalidades',
    timestamps: true
});

export default Mensalidade;