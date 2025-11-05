# 🎯 NOVO FLUXO - SchoolManager

## 📝 Como Funciona Agora

### **Fluxo igual ao Gmail/Google:**

```
1. Usuário se cadastra (nome, email, senha)
   ↓
2. Usuário cria um estabelecimento (escola/negócio)
   ↓
3. Usuário gerencia mensalidades e compras desse estabelecimento
```

---

## 🚀 Passo a Passo para o Frontend

### **PASSO 1: Cadastro do Usuário** ✅

```http
POST /usuarios
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "telefone": "(11) 99999-9999"  // opcional
}
```

**Resposta:**
```json
{
  "message": "Usuário criado com sucesso! Agora você pode criar seu estabelecimento.",
  "usuario": {
    "id_usuario": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "ativo": true,
    "data_cadastro": "2025-11-05T10:00:00.000Z"
  }
}
```

⚠️ **Guarde o `id_usuario` para os próximos passos!**

---

### **PASSO 2: Login** ✅

```http
POST /usuarios/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "message": "usuario logado com sucesso"
}
```

💡 **TODO:** Implementar JWT - por enquanto, o frontend deve guardar o ID do usuário

---

### **PASSO 3: Criar Estabelecimento** ✅

Depois de logado, o usuário cria seu estabelecimento:

```http
POST /estabelecimentos
Content-Type: application/json

{
  "id_criador": 1,              // ID do usuário logado
  "nome": "Escola ABC",
  "cnpj": "12.345.678/0001-90", // opcional
  "endereco": "Rua das Flores, 123",
  "telefone": "(11) 98765-4321",
  "email": "contato@escolaabc.com"
}
```

**Resposta:**
```json
{
  "message": "Estabelecimento criado com sucesso! Você já pode gerenciar mensalidades e compras.",
  "estabelecimento": {
    "id_estabelecimento": 1,
    "id_criador": 1,
    "nome": "Escola ABC",
    "cnpj": "12.345.678/0001-90",
    "endereco": "Rua das Flores, 123",
    "telefone": "(11) 98765-4321",
    "email": "contato@escolaabc.com",
    "ativo": true,
    "data_adesao": "2025-11-05T10:00:00.000Z"
  }
}
```

---

### **PASSO 4: Listar Estabelecimentos do Usuário** ✅

```http
GET /estabelecimentos/usuario/:idUsuario
```

**Exemplo:**
```http
GET /estabelecimentos/usuario/1
```

**Resposta:**
```json
[
  {
    "id_estabelecimento": 1,
    "id_criador": 1,
    "nome": "Escola ABC",
    "cnpj": "12.345.678/0001-90",
    "papel": "proprietario",  // proprietario, admin, colaborador
    "data_vinculo": "2025-11-05T10:00:00.000Z"
  },
  {
    "id_estabelecimento": 2,
    "nome": "Colégio XYZ",
    "papel": "colaborador",
    "data_vinculo": "2025-11-06T10:00:00.000Z"
  }
]
```

💡 **Um usuário pode ter vários estabelecimentos!**

---

### **PASSO 5: Gerenciar Mensalidades** ✅

Agora sim, com o estabelecimento criado:

#### **5.1 - Criar Pagador**
```http
POST /pagadores
Content-Type: application/json

{
  "id_estabelecimento": 1,
  "nome": "Maria Oliveira",
  "telefone": "(11) 91234-5678",
  "data_cadastro": "2025-11-05"
}
```

#### **5.2 - Criar Mensalidade**
```http
POST /mensalidades
Content-Type: application/json

{
  "id_estabelecimento": 1,
  "id_pagador": 1,
  "valor": 500.00,
  "data_vencimento": "2025-12-05",
  "status": "pendente",
  "descricao": "Mensalidade de novembro"
}
```

---

### **PASSO 6: Gerenciar Compras** ✅

#### **6.1 - Criar Compra**
```http
POST /compras
Content-Type: application/json

{
  "id_estabelecimento": 1,
  "id_usuario_responsavel": 1,  // Quem está fazendo a compra
  "valor_unitario": 15.00,
  "valor_total": 300.00,
  "data_compra": "2025-11-05",
  "descricao": "Material escolar"
}
```

#### **6.2 - Adicionar Itens na Compra**
```http
POST /itens-compra
Content-Type: application/json

{
  "id_compra": 1,
  "nome_produto": "Caderno 10 matérias",
  "quantidade": 20,
  "valor_unitario": 15.00,
  "valor_total": 300.00,
  "categoria": "Papelaria"
}
```

---

## 🎨 Sugestão de Telas para o Frontend

### **1. Tela de Registro**
- Nome
- Email
- Senha
- Telefone (opcional)
- Botão: "Criar Conta"

### **2. Tela de Login**
- Email
- Senha
- Botão: "Entrar"

### **3. Dashboard (após login)**
Opções:
- **Criar Novo Estabelecimento** (se não tiver nenhum)
- **Meus Estabelecimentos** (lista dos que gerencia)
- **Selecionar Estabelecimento** (escolhe qual vai gerenciar)

### **4. Tela do Estabelecimento (após selecionar)**
Menu lateral:
- 📊 Dashboard
- 💰 Mensalidades
  - Lista de pagadores
  - Criar/editar mensalidades
  - Ver pendentes/pagas
- 🛒 Compras
  - Nova compra
  - Histórico
- ⚙️ Configurações do Estabelecimento

---

## 🔑 Conceitos Importantes

### **Multi-Tenant**
- Cada estabelecimento é um "tenant" (inquilino)
- Usuários podem gerenciar vários estabelecimentos
- Dados ficam isolados por estabelecimento

### **Papéis (Roles)**
- **proprietario**: Criou o estabelecimento, controle total
- **admin**: Administrador convidado
- **colaborador**: Pode visualizar e editar
- **professor**: Acesso limitado (futuro)

### **Fluxo de Dados**
```
Usuario (João)
  └── Estabelecimento 1 (Escola ABC)
       ├── Pagadores
       │    └── Mensalidades
       └── Compras
            └── Itens de Compra
  
  └── Estabelecimento 2 (Colégio XYZ)  
       └── (dados separados)
```

---

## ⚠️ Campos Obrigatórios

### **Cadastro de Usuário**
- ✅ nome
- ✅ email
- ✅ senha

### **Criar Estabelecimento**
- ✅ id_criador (ID do usuário logado)
- ✅ nome
- ⚪ cnpj (opcional)
- ⚪ endereco (opcional)
- ⚪ telefone (opcional)
- ⚪ email (opcional)

### **Criar Pagador**
- ✅ id_estabelecimento
- ✅ nome
- ⚪ telefone (opcional)
- ✅ data_cadastro

### **Criar Mensalidade**
- ✅ id_estabelecimento
- ✅ id_pagador
- ✅ valor
- ✅ data_vencimento
- ⚪ status (default: "pendente")

### **Criar Compra**
- ✅ id_estabelecimento
- ✅ id_usuario_responsavel
- ✅ valor_unitario
- ✅ valor_total

---

## 💡 Próximos Passos (Melhorias Futuras)

1. **JWT Authentication** - Token para manter usuário logado
2. **Convites** - Adicionar outros usuários ao estabelecimento
3. **Permissões** - Controle fino por papel (role)
4. **Dashboard** - Estatísticas e gráficos
5. **Relatórios** - PDF de mensalidades
6. **Notificações** - Email para mensalidades vencendo

---

## 🐛 Debugging

Se algo não funcionar:

1. **Apagar o banco de dados** (SQLite cria automaticamente)
   ```bash
   # No terminal do backend
   rm database.sqlite  # ou delete manualmente
   npm run dev         # Recria o banco
   ```

2. **Verificar se os relacionamentos foram criados**
   - O Sequelize cria as tabelas automaticamente
   - Se mudou models, precisa recriar o banco

3. **Ordem correta**
   - Criar usuário ANTES
   - Criar estabelecimento DEPOIS
   - Criar pagador/compras DEPOIS do estabelecimento

---

**Dúvidas? Só chamar! 🚀**
