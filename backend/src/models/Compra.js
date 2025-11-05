import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Compra = sequelize.define('Compra', {
    id_compra: {
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
    id_usuario_responsavel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
        }
    },
    item: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    valor_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    data_compra: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'compras',
    timestamps: true
});

export default Compra;