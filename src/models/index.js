import Estabelecimento from "./Estabelecimento.js";
import Usuario from "./Usuario.js";
import Pagador from "./Pagador.js";
import Mensalidade from "./Mensalidade.js";
import Compra from "./Compra.js";

// ==========================================
// RELACIONAMENTOS COM ESTABELECIMENTO (Tenant)
// ==========================================

// Um Estabelecimento tem muitos Usuários
Estabelecimento.hasMany(Usuario, {
    foreignKey: 'id_estabelecimento',
    as: 'usuarios'
});

// Um Usuário pertence a um Estabelecimento
Usuario.belongsTo(Estabelecimento, {
    foreignKey: 'id_estabelecimento',
    as: 'estabelecimento'
});

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

// Um Usuário tem muitas Compras
Usuario.hasMany(Compra, {
    foreignKey: 'id_usuario',
    as: 'compras'
});

// Uma Compra pertence a um Usuário
Compra.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});

// ==========================================
// EXPORTAR TODOS OS MODELS
// ==========================================

export {
    Estabelecimento,
    Usuario,
    Pagador,
    Mensalidade,
    Compra
};