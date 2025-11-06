import Usuario from "../models/Usuario.js";
import Estabelecimento from "../models/Estabelecimento.js";
import UsuarioEstabelecimento from "../models/UsuarioEstabelecimento.js";
import Pagador from "../models/Pagador.js";
import Mensalidade from "../models/Mensalidade.js";
import Compra from "../models/Compra.js";
import ItemCompra from "../models/ItemCompra.js";
import { CryptoManager } from "./crypto.js";

export async function popularBanco() {
    try {
        console.log("🗑️  Limpando banco de dados...");
        
        // Dropar todas as tabelas na ordem correta (respeitar foreign keys)
        await ItemCompra.drop();
        await Compra.drop();
        await Mensalidade.drop();
        await Pagador.drop();
        await UsuarioEstabelecimento.drop();
        await Estabelecimento.drop();
        await Usuario.drop();
        
        console.log("✅ Tabelas dropadas");
        
        // Recriar as tabelas
        await Usuario.sync();
        await Estabelecimento.sync();
        await UsuarioEstabelecimento.sync();
        await Pagador.sync();
        await Mensalidade.sync();
        await Compra.sync();
        await ItemCompra.sync();
        
        console.log("✅ Tabelas recriadas");
        console.log("🌱 Populando banco de dados com dados de teste...");

        // 1. CRIAR USUÁRIOS
        const usuario1 = await Usuario.create({
            nome: "João Silva",
            email: "joao@email.com",
            senha: await CryptoManager.generateHash("senha123"),
            telefone: "(11) 98765-4321",
            ativo: true
        });

        const usuario2 = await Usuario.create({
            nome: "Maria Santos",
            email: "maria@email.com",
            senha: await CryptoManager.generateHash("senha456"),
            telefone: "(11) 91234-5678",
            ativo: true
        });

        console.log("✅ Usuários criados");

        // 2. CRIAR ESTABELECIMENTOS
        const estabelecimento1 = await Estabelecimento.create({
            id_criador: usuario1.id_usuario,
            nome: "Escola ABC",
            cnpj: "12.345.678/0001-90",
            endereco: "Rua das Flores, 123 - Centro",
            telefone: "(11) 3333-4444",
            email: "contato@escolaabc.com",
            ativo: true
        });

        const estabelecimento2 = await Estabelecimento.create({
            id_criador: usuario2.id_usuario,
            nome: "Colégio XYZ",
            cnpj: "98.765.432/0001-10",
            endereco: "Av. Principal, 456 - Jardim",
            telefone: "(11) 5555-6666",
            email: "contato@colegioxyz.com",
            ativo: true
        });

        console.log("✅ Estabelecimentos criados");

        // 3. VINCULAR USUÁRIOS AOS ESTABELECIMENTOS
        await UsuarioEstabelecimento.create({
            id_usuario: usuario1.id_usuario,
            id_estabelecimento: estabelecimento1.id_estabelecimento,
            papel: "proprietario",
            ativo: true
        });

        await UsuarioEstabelecimento.create({
            id_usuario: usuario2.id_usuario,
            id_estabelecimento: estabelecimento2.id_estabelecimento,
            papel: "proprietario",
            ativo: true
        });

        // Adicionar Maria como colaboradora na Escola ABC
        await UsuarioEstabelecimento.create({
            id_usuario: usuario2.id_usuario,
            id_estabelecimento: estabelecimento1.id_estabelecimento,
            papel: "colaborador",
            ativo: true
        });

        console.log("✅ Vínculos criados");

        // 4. CRIAR PAGADORES
        const pagador1 = await Pagador.create({
            id_estabelecimento: estabelecimento1.id_estabelecimento,
            nome: "Carlos Oliveira (pai do Pedro)",
            telefone: "(11) 99999-1111",
            data_cadastro: new Date()
        });

        const pagador2 = await Pagador.create({
            id_estabelecimento: estabelecimento1.id_estabelecimento,
            nome: "Ana Costa (mãe da Julia)",
            telefone: "(11) 88888-2222",
            data_cadastro: new Date()
        });

        const pagador3 = await Pagador.create({
            id_estabelecimento: estabelecimento2.id_estabelecimento,
            nome: "Roberto Lima",
            telefone: "(11) 77777-3333",
            data_cadastro: new Date()
        });

        console.log("✅ Pagadores criados");

        // 5. CRIAR MENSALIDADES
        // Mensalidades PAGAS
        await Mensalidade.create({
            id_estabelecimento: estabelecimento1.id_estabelecimento,
            id_pagador: pagador1.id_pagador,
            valor: 500.00,
            data_vencimento: "2025-10-05",
            data_pagamento: "2025-10-03",
            status: "pago",
            descricao: "Mensalidade de outubro"
        });

        // Mensalidades PENDENTES
        await Mensalidade.create({
            id_estabelecimento: estabelecimento1.id_estabelecimento,
            id_pagador: pagador1.id_pagador,
            valor: 500.00,
            data_vencimento: "2025-11-05",
            data_pagamento: null,
            status: "pendente",
            descricao: "Mensalidade de novembro"
        });

        await Mensalidade.create({
            id_estabelecimento: estabelecimento1.id_estabelecimento,
            id_pagador: pagador2.id_pagador,
            valor: 600.00,
            data_vencimento: "2025-11-10",
            data_pagamento: null,
            status: "pendente",
            descricao: "Mensalidade de novembro"
        });

        // Mensalidade ATRASADA
        await Mensalidade.create({
            id_estabelecimento: estabelecimento1.id_estabelecimento,
            id_pagador: pagador2.id_pagador,
            valor: 600.00,
            data_vencimento: "2025-10-10",
            data_pagamento: null,
            status: "atrasado",
            descricao: "Mensalidade de outubro (ATRASADA)"
        });

        await Mensalidade.create({
            id_estabelecimento: estabelecimento2.id_estabelecimento,
            id_pagador: pagador3.id_pagador,
            valor: 750.00,
            data_vencimento: "2025-11-15",
            data_pagamento: null,
            status: "pendente",
            descricao: "Mensalidade de novembro"
        });

        console.log("✅ Mensalidades criadas");

        // 6. CRIAR COMPRAS
        const compra1 = await Compra.create({
            id_estabelecimento: estabelecimento1.id_estabelecimento,
            id_usuario_responsavel: usuario1.id_usuario,
            item: "Material escolar",
            valor_unitario: 15.00,
            valor_total: 450.00,
            data_compra: new Date("2025-11-01"),
            descricao: "Compra de material para o mês"
        });

        const compra2 = await Compra.create({
            id_estabelecimento: estabelecimento1.id_estabelecimento,
            id_usuario_responsavel: usuario2.id_usuario,
            item: "Equipamentos",
            valor_unitario: 250.00,
            valor_total: 1000.00,
            data_compra: new Date("2025-11-03"),
            descricao: "Computadores para laboratório"
        });

        console.log("✅ Compras criadas");

        // 7. CRIAR ITENS DAS COMPRAS
        await ItemCompra.create({
            id_compra: compra1.id_compra,
            nome_produto: "Caderno 10 matérias",
            quantidade: 20,
            valor_unitario: 15.00,
            valor_total: 300.00,
            categoria: "Papelaria",
            observacao: "Capa dura, espiral"
        });

        await ItemCompra.create({
            id_compra: compra1.id_compra,
            nome_produto: "Caneta azul",
            quantidade: 50,
            valor_unitario: 2.00,
            valor_total: 100.00,
            categoria: "Papelaria",
            observacao: "Ponta fina"
        });

        await ItemCompra.create({
            id_compra: compra1.id_compra,
            nome_produto: "Lápis HB",
            quantidade: 50,
            valor_unitario: 1.00,
            valor_total: 50.00,
            categoria: "Papelaria"
        });

        await ItemCompra.create({
            id_compra: compra2.id_compra,
            nome_produto: "Computador Desktop",
            quantidade: 4,
            valor_unitario: 250.00,
            valor_total: 1000.00,
            categoria: "Eletrônicos",
            observacao: "8GB RAM, SSD 256GB"
        });

        console.log("✅ Itens de compra criados");

        console.log("\n🎉 Banco de dados populado com sucesso!\n");
        console.log("📊 Dados criados:");
        console.log("   - 2 Usuários (joao@email.com / maria@email.com)");
        console.log("   - 2 Estabelecimentos (Escola ABC / Colégio XYZ)");
        console.log("   - 3 Pagadores");
        console.log("   - 5 Mensalidades (2 pagas, 2 pendentes, 1 atrasada)");
        console.log("   - 2 Compras");
        console.log("   - 4 Itens de compra");
        console.log("\n🔑 Login de teste:");
        console.log("   Email: joao@email.com");
        console.log("   Senha: senha123\n");

    } catch (erro) {
        console.error("❌ Erro ao popular banco:", erro);
    }
}
