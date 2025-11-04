//id, nome, cnpj, data_adesao
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Estabelecimento = sequelize.define("Estabelecimento", {
    id_estabelecimento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnpj: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    data_adesao: {
            type: DataTypes.DATE,
            allowNull: false
    }

},{
    tableName: 'estabelecimentos',
    timestamps: true
});

export default Estabelecimento;