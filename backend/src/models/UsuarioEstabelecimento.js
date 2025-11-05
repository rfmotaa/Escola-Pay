// Tabela intermediária: vincula Usuários a Estabelecimentos
// Permite que um usuário gerencie vários estabelecimentos
// E um estabelecimento tenha vários usuários (admin, colaboradores)

import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const UsuarioEstabelecimento = sequelize.define('UsuarioEstabelecimento', {
    id_usuario_estabelecimento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
        }
    },
    id_estabelecimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'estabelecimentos',
            key: 'id_estabelecimento'
        }
    },
    papel: {
        type: DataTypes.ENUM('proprietario', 'admin', 'colaborador', 'professor'),
        defaultValue: 'colaborador'
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    data_vinculo: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'usuarios_estabelecimentos',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['id_usuario', 'id_estabelecimento']
        }
    ]
});

export default UsuarioEstabelecimento;
