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

        // Criar um pagador de exemplo
        await Pagador.create({
            id_estabelecimento: estabelecimentoTeste.id_estabelecimento,
            nome: "Pagador Exemplo",
            telefone: "(11) 98888-8888",
            data_cadastro: new Date()
        });

        console.log("✅ Pagador de exemplo criado");

        console.log("\n🎉 Banco de dados inicializado!\n");
        console.log("📊 Dados criados:");
        console.log("   - 1 Usuário de teste");
        console.log("   - 1 Estabelecimento vinculado");
        console.log("   - 1 Pagador de exemplo");
        console.log("\n🔑 Login de teste:");
        console.log("   Email: teste@email.com");
        console.log("   Senha: teste123");
        console.log("\n💡 Agora você pode adicionar compras e mensalidades!\n");

    } catch (erro) {
        console.error("❌ Erro ao popular banco:", erro);
    }
}
