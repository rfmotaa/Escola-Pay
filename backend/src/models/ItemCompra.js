import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const ItemCompra = sequelize.define('ItemCompra', {
    id_item_compra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_compra: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'compras',
            key: 'id_compra'
        }
    },
    nome_produto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    valor_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: true
    },
    observacao: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'itens_compra',
    timestamps: true
});

export default ItemCompra;
