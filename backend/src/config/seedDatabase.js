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
        console.log("🌱 Criando usuário de teste...");

        // Criar usuário de teste
        const usuarioTeste = await Usuario.create({
            nome: "Usuário Teste",
            email: "teste@email.com",
            senha: await CryptoManager.generateHash("teste123"),
            telefone: "(11) 99999-9999",
            ativo: true
        });

        console.log("✅ Usuário de teste criado");

        // Criar estabelecimento de teste
        const estabelecimentoTeste = await Estabelecimento.create({
            id_criador: usuarioTeste.id_usuario,
            nome: "Meu Estabelecimento",
            cnpj: "00.000.000/0001-00",
            endereco: "Rua Exemplo, 123",
            telefone: "(11) 3333-4444",
            email: "contato@estabelecimento.com",
            ativo: true
        });

        console.log("✅ Estabelecimento de teste criado");

        // Vincular usuário ao estabelecimento
        await UsuarioEstabelecimento.create({
            id_usuario: usuarioTeste.id_usuario,
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            papel: "proprietario",
            ativo: true
        });

        console.log("✅ Vínculo criado");

        // Criar múltiplos pagadores de exemplo
        const pagador1 = await Pagador.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            nome: "João Silva",
            telefone: "(11) 98888-1111",
            data_cadastro: new Date('2025-08-15')
        });

        const pagador2 = await Pagador.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            nome: "Maria Santos",
            telefone: "(11) 98888-2222",
            data_cadastro: new Date('2025-09-20')
        });

        const pagador3 = await Pagador.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            nome: "Pedro Oliveira",
            telefone: "(11) 98888-3333",
            data_cadastro: new Date('2025-10-10')
        });

        const pagador4 = await Pagador.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            nome: "Ana Costa",
            telefone: "(11) 98888-4444",
            data_cadastro: new Date('2025-10-05')
        });

        const pagador5 = await Pagador.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            nome: "Carlos Mendes",
            telefone: "(11) 98888-5555",
            data_cadastro: new Date('2025-11-12')
        });

        console.log("✅ Pagadores criados");

        // Criar mensalidades para os pagadores
        // Mensalidades do pagador 1 (João Silva) - alguns pagos, alguns pendentes
        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador1.id_pagador,
            mes_referencia: "10/2025",
            valor: 850.00,
            data_vencimento: new Date('2025-10-10'),
            status: "pago",
            data_pagamento: new Date('2025-10-08')
        });

        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador1.id_pagador,
            mes_referencia: "11/2025",
            valor: 850.00,
            data_vencimento: new Date('2025-11-10'),
            status: "pago",
            data_pagamento: new Date('2025-11-09')
        });

        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador1.id_pagador,
            mes_referencia: "12/2025",
            valor: 850.00,
            data_vencimento: new Date('2025-12-10'),
            status: "pendente"
        });

        // Mensalidades do pagador 2 (Maria Santos)
        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador2.id_pagador,
            mes_referencia: "10/2025",
            valor: 920.00,
            data_vencimento: new Date('2025-10-15'),
            status: "pago",
            data_pagamento: new Date('2025-10-14')
        });

        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador2.id_pagador,
            mes_referencia: "11/2025",
            valor: 920.00,
            data_vencimento: new Date('2025-11-15'),
            status: "pago",
            data_pagamento: new Date('2025-11-15')
        });

        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador2.id_pagador,
            mes_referencia: "12/2025",
            valor: 920.00,
            data_vencimento: new Date('2025-12-15'),
            status: "pendente"
        });

        // Mensalidades do pagador 3 (Pedro Oliveira)
        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador3.id_pagador,
            mes_referencia: "11/2025",
            valor: 750.00,
            data_vencimento: new Date('2025-11-20'),
            status: "pago",
            data_pagamento: new Date('2025-11-19')
        });

        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador3.id_pagador,
            mes_referencia: "12/2025",
            valor: 750.00,
            data_vencimento: new Date('2025-12-20'),
            status: "pendente"
        });

        // Mensalidades do pagador 4 (Ana Costa)
        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador4.id_pagador,
            mes_referencia: "11/2025",
            valor: 1100.00,
            data_vencimento: new Date('2025-11-05'),
            status: "pago",
            data_pagamento: new Date('2025-11-03')
        });

        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador4.id_pagador,
            mes_referencia: "12/2025",
            valor: 1100.00,
            data_vencimento: new Date('2025-12-05'),
            status: "pendente"
        });

        // Mensalidades do pagador 5 (Carlos Mendes)
        await Mensalidade.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_pagador: pagador5.id_pagador,
            mes_referencia: "12/2025",
            valor: 680.00,
            data_vencimento: new Date('2025-12-25'),
            status: "pendente"
        });

        console.log("✅ Mensalidades criadas");

        // Criar compras com itens
        const compra1 = await Compra.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_usuario_responsavel: usuarioTeste.id_usuario,
            nome_compra: "Compra de Material Escolar - Outubro",
            categoria: "Material Escolar",
            data_compra: new Date('2025-10-15'),
            valor_total: 245.50,
            descricao: "Compra de material escolar e livros didáticos para o ano letivo"
        });

        await ItemCompra.create({
            id_compra: compra1.id_compra,
            nome_produto: "Material Escolar",
            quantidade: 1,
            valor_unitario: 89.90,
            valor_total: 89.90,
            categoria: "Material Escolar"
        });

        await ItemCompra.create({
            id_compra: compra1.id_compra,
            nome_produto: "Livros Didáticos",
            quantidade: 3,
            valor_unitario: 51.87,
            valor_total: 155.60,
            categoria: "Livros"
        });

        const compra2 = await Compra.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_usuario_responsavel: usuarioTeste.id_usuario,
            nome_compra: "Uniformes Escolares - Outubro",
            categoria: "Uniformes",
            data_compra: new Date('2025-10-25'),
            valor_total: 125.00,
            descricao: "Aquisição de uniformes escolares"
        });

        await ItemCompra.create({
            id_compra: compra2.id_compra,
            nome_produto: "Uniforme Escolar",
            quantidade: 2,
            valor_unitario: 62.50,
            valor_total: 125.00,
            categoria: "Uniformes"
        });

        const compra3 = await Compra.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_usuario_responsavel: usuarioTeste.id_usuario,
            nome_compra: "Notebook para Aulas - Novembro",
            categoria: "Tecnologia",
            data_compra: new Date('2025-11-05'),
            valor_total: 350.00,
            descricao: "Notebook para uso em aulas online"
        });

        await ItemCompra.create({
            id_compra: compra3.id_compra,
            nome_produto: "Notebook para aulas",
            quantidade: 1,
            valor_unitario: 350.00,
            valor_total: 350.00,
            categoria: "Tecnologia"
        });

        const compra4 = await Compra.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_usuario_responsavel: usuarioTeste.id_usuario,
            nome_compra: "Apostilas do Semestre - Novembro",
            categoria: "Material Didático",
            data_compra: new Date('2025-11-12'),
            valor_total: 180.00,
            descricao: "Apostilas para o semestre letivo"
        });

        await ItemCompra.create({
            id_compra: compra4.id_compra,
            nome_produto: "Apostilas",
            quantidade: 5,
            valor_unitario: 36.00,
            valor_total: 180.00,
            categoria: "Material Didático"
        });

        const compra5 = await Compra.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_usuario_responsavel: usuarioTeste.id_usuario,
            nome_compra: "Material de Matemática - Novembro",
            categoria: "Material Escolar",
            data_compra: new Date('2025-11-18'),
            valor_total: 95.00,
            descricao: "Calculadora e instrumentos de geometria"
        });

        await ItemCompra.create({
            id_compra: compra5.id_compra,
            nome_produto: "Calculadora Científica",
            quantidade: 1,
            valor_unitario: 45.00,
            valor_total: 45.00,
            categoria: "Tecnologia"
        });

        await ItemCompra.create({
            id_compra: compra5.id_compra,
            nome_produto: "Régua e Compasso",
            quantidade: 1,
            valor_unitario: 50.00,
            valor_total: 50.00,
            categoria: "Material Escolar"
        });

        const compra6 = await Compra.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_usuario_responsavel: usuarioTeste.id_usuario,
            nome_compra: "Pacote Premium de Livros - Novembro",
            categoria: "Livros",
            data_compra: new Date('2025-11-22'),
            valor_total: 420.00,
            descricao: "Coleção premium de livros para biblioteca pessoal"
        });

        await ItemCompra.create({
            id_compra: compra6.id_compra,
            nome_produto: "Pacote de Livros Premium",
            quantidade: 1,
            valor_unitario: 420.00,
            valor_total: 420.00,
            categoria: "Livros"
        });

        const compra7 = await Compra.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_usuario_responsavel: usuarioTeste.id_usuario,
            nome_compra: "Cadernos do Semestre - Dezembro",
            categoria: "Material Escolar",
            data_compra: new Date('2025-12-02'),
            valor_total: 75.00,
            descricao: "Cadernos para as disciplinas do semestre"
        });

        await ItemCompra.create({
            id_compra: compra7.id_compra,
            nome_produto: "Cadernos",
            quantidade: 5,
            valor_unitario: 15.00,
            valor_total: 75.00,
            categoria: "Material Escolar"
        });

        const compra8 = await Compra.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            id_usuario_responsavel: usuarioTeste.id_usuario,
            nome_compra: "Material de Arte - Dezembro",
            categoria: "Arte",
            data_compra: new Date('2025-12-05'),
            valor_total: 200.00,
            descricao: "Material completo para aulas de arte"
        });

        await ItemCompra.create({
            id_compra: compra8.id_compra,
            nome_produto: "Material de Arte",
            quantidade: 1,
            valor_unitario: 120.00,
            valor_total: 120.00,
            categoria: "Arte"
        });

        await ItemCompra.create({
            id_compra: compra8.id_compra,
            nome_produto: "Tinta e Pincéis",
            quantidade: 2,
            valor_unitario: 40.00,
            valor_total: 80.00,
            categoria: "Arte"
        });

        console.log("✅ Compras e itens criados");

        console.log("\n🎉 Banco de dados inicializado com dados completos!\n");
        console.log("📊 Dados criados:");
        console.log("   - 1 Usuário de teste");
        console.log("   - 1 Estabelecimento vinculado");
        console.log("   - 5 Pagadores");
        console.log("   - 12 Mensalidades (pagas, pendentes e atrasadas)");
        console.log("   - 8 Compras com múltiplos itens");
        console.log("\n🔑 Login de teste:");
        console.log("   Email: teste@email.com");
        console.log("   Senha: teste123");
        console.log("\n💡 O sistema está populado e pronto para testes!\n");

    } catch (erro) {
        console.error("❌ Erro ao popular banco:", erro);
    }
}
