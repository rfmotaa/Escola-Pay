import Estabelecimento from "./Estabelecimento.js";
import Usuario from "./Usuario.js";
import UsuarioEstabelecimento from "./UsuarioEstabelecimento.js";
import Pagador from "./Pagador.js";
import Mensalidade from "./Mensalidade.js";
import Compra from "./Compra.js";
import ItemCompra from "./ItemCompra.js";

// ==========================================
// RELACIONAMENTO USUARIO <-> ESTABELECIMENTO
// ==========================================

// Um Usuário pode criar vários Estabelecimentos
Usuario.hasMany(Estabelecimento, {
    foreignKey: 'id_criador',
    as: 'estabelecimentosCriados'
});

// Um Estabelecimento tem um criador
Estabelecimento.belongsTo(Usuario, {
    foreignKey: 'id_criador',
    as: 'criador'
});

// Relacionamento Muitos-para-Muitos (usuário pode gerenciar vários estabelecimentos)
Usuario.belongsToMany(Estabelecimento, {
    through: UsuarioEstabelecimento,
    foreignKey: 'id_usuario',
    otherKey: 'id_estabelecimento',
    as: 'estabelecimentos'
});

Estabelecimento.belongsToMany(Usuario, {
    through: UsuarioEstabelecimento,
    foreignKey: 'id_estabelecimento',
    otherKey: 'id_usuario',
    as: 'usuarios'
});

// Relacionamentos diretos da tabela intermediária
UsuarioEstabelecimento.belongsTo(Estabelecimento, {
    foreignKey: 'id_estabelecimento',
    as: 'estabelecimento'
});

UsuarioEstabelecimento.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});

// ==========================================
// RELACIONAMENTOS COM ESTABELECIMENTO (Tenant)
// ==========================================

// Um Estabelecimento tem muitos Pagadores
Estabelecimento.hasMany(Pagador, {
    foreignKey: 'id_estabelecimento',
    as: 'pagadores'
});

// Um Pagador pertence a um Estabelecimento
Pagador.belongsTo(Estabelecimento, {
    foreignKey: 'id_estabelecimento',
    as: 'estabelecimento'
});

// Um Estabelecimento tem muitas Mensalidades
Estabelecimento.hasMany(Mensalidade, {
    foreignKey: 'id_estabelecimento',
    as: 'mensalidades'
});

// Uma Mensalidade pertence a um Estabelecimento
Mensalidade.belongsTo(Estabelecimento, {
    foreignKey: 'id_estabelecimento',
    as: 'estabelecimento'
});

// Um Estabelecimento tem muitas Compras
Estabelecimento.hasMany(Compra, {
    foreignKey: 'id_estabelecimento',
    as: 'compras'
});

// Uma Compra pertence a um Estabelecimento
Compra.belongsTo(Estabelecimento, {
    foreignKey: 'id_estabelecimento',
    as: 'estabelecimento'
});

// ==========================================
// RELACIONAMENTOS FUNCIONAIS
// ==========================================

// Um Pagador tem muitas Mensalidades
Pagador.hasMany(Mensalidade, {
    foreignKey: 'id_pagador',
    as: 'mensalidades'
});

// Uma Mensalidade pertence a um Pagador
Mensalidade.belongsTo(Pagador, {
    foreignKey: 'id_pagador',
    as: 'pagador'
});

// Uma Compra tem um responsável (usuário que fez a compra)
// Agora vinculado através da tabela intermediária
Compra.belongsTo(Usuario, {
    foreignKey: 'id_usuario_responsavel',
    as: 'responsavel'
});

Usuario.hasMany(Compra, {
    foreignKey: 'id_usuario_responsavel',
    as: 'comprasRealizadas'
});

// Uma Compra tem muitos Itens
Compra.hasMany(ItemCompra, {
    foreignKey: 'id_compra',
    as: 'itens'
});

// Um Item pertence a uma Compra
ItemCompra.belongsTo(Compra, {
    foreignKey: 'id_compra',
    as: 'compra'
});

// ==========================================
// EXPORTAR TODOS OS MODELS
// ==========================================

export {
    Estabelecimento,
    Usuario,
    UsuarioEstabelecimento,
    Pagador,
    Mensalidade,
    Compra,
    ItemCompra
};