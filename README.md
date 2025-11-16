Repositório destinado ao projeto acadêmico da matéria de Desenvolvimento Web 2, o mesmo tem o objetivo de implementar um sistema completo com frontend e backend, visando demonstrar as competências da matéria.

## 🎯 Objetivo
Criar um sistema para gerenciamento de escolas que:
- Seja claro e intuitivo
- Resolva problemas de organização
- Implemente as regras de negócio

<h1 align="center">🏫 EscolaPay</h1>

<div align="center">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</div>

## 💻 Como rodar

### 📥 1. Clone este repositório
Abra o terminal e execute:
```bash
git clone https://github.com/rfmotaa/SchoolManager.git
cd EscolaPay
```

### ⚙️ 2. Configure as variáveis de ambiente

**Backend:**
```bash
cd backend
cp .env.example .env
```

Abra o arquivo `.env` e ajuste as variáveis se necessário. As configurações padrão já funcionam.

### 📦 3. Instale as dependências do Backend

```bash
npm install
```

### 🚀 4. Inicie o servidor backend

```bash
node server.js
```

✅ O servidor estará rodando em `http://localhost:3000`
📚 Documentação da API: `http://localhost:3000/api-docs`

### 🎨 5. Configure e inicie o Frontend

**Abra um novo terminal** e execute:

```bash
cd frontend
npm install
npm run dev
```

✅ O frontend estará rodando em `http://localhost:5173`

### 🎯 6. Acesse o sistema

Abra seu navegador em `http://localhost:5173`

**Fluxo inicial:**
1. Clique em "Criar Conta"
2. Preencha seus dados e cadastre-se
3. Faça login com seu email e senha
4. Configure seu estabelecimento no onboarding
5. Comece a usar o sistema! 🎉

---

## 🛠️ Tecnologias Utilizadas

**Backend:**
- Node.js + Express
- SQLite (banco de dados)
- JWT (autenticação)
- Sequelize (ORM)
- Swagger (documentação)

**Frontend:**
- React + Vite
- TailwindCSS
- shadcn/ui
- React Router
- Axios

---

## 📝 Variáveis de Ambiente

O arquivo `.env.example` contém todas as variáveis necessárias:

```env
SALT_ROUNDS=10
SALT_VALUE=$2b$10$abcdefghijklmnopqrstuv
PORT=3000
JWT_SECRET=escolapay_super_secret_key_change_in_production_2025
JWT_EXPIRES_IN=7d
```

⚠️ **Importante:** Nunca commite o arquivo `.env` no Git. Ele está no `.gitignore`.

---

## 🔧 Troubleshooting

**Erro: "secretOrPrivateKey must have a value"**
- ✅ Certifique-se de ter criado o arquivo `.env` a partir do `.env.example`
- ✅ Reinicie o servidor backend

**Erro: "EADDRINUSE :::3000"**
- ✅ A porta 3000 já está em uso. Feche outros processos ou altere a `PORT` no `.env`

**Banco de dados vazio após clonar**
- ✅ Normal! O banco é criado automaticamente ao iniciar o backend
- ✅ Cadastre um usuário pelo frontend


## 📫 Contato

<h2>Rafael Mota</h2>

<p>
   <a href="https://github.com/rfmotaa"> <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" /> </a>
   <a href="mailto:rafaelssoni1000@gmail.com"> <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" /> </a>
   <a href="https://www.linkedin.com/in/rfmota/"> <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" /> </a>
</p>


<h2> Leonardo de Oliveira </h2>

<p>
   <a href="https://github.com/niteoliveira"> <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" /> </a>
</p>

<h2> João Paulo </h2>

<p>
   <a href="https://github.com/jpegame"> <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" /> </a>
   <a href="mailto:joao.paulo07040520@gmail.com"> <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" /> </a>
   <a href=""> <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" /> </a>
</p>
