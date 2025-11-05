// ====================================
// EXEMPLOS DE MIDDLEWARES
// ====================================

// 1. MIDDLEWARE DE LOG CUSTOMIZADO
export const logMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    next(); // Passa para o próximo middleware
};

// 2. MIDDLEWARE DE AUTENTICAÇÃO (exemplo)
export const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    // Aqui você validaria o token (JWT, por exemplo)
    // if (!validarToken(token)) {
    //     return res.status(403).json({ message: 'Token inválido' });
    // }
    
    next(); // Se estiver tudo OK, passa adiante
};

// 3. MIDDLEWARE DE VALIDAÇÃO DE DADOS
export const validarDadosMiddleware = (req, res, next) => {
    const { nome, email } = req.body;
    
    if (!nome || !email) {
        return res.status(400).json({ 
            message: 'Nome e email são obrigatórios' 
        });
    }
    
    next();
};

// 4. MIDDLEWARE DE TEMPO DE RESPOSTA
export const tempoRespostaMiddleware = (req, res, next) => {
    const inicio = Date.now();
    
    // Intercepta o fim da resposta
    res.on('finish', () => {
        const duracao = Date.now() - inicio;
        console.log(`⏱️  Tempo de resposta: ${duracao}ms - ${req.method} ${req.url}`);
    });
    
    next();
};

// 5. MIDDLEWARE DE CORS (permite requisições de outros domínios)
export const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
};

// 6. MIDDLEWARE DE TRATAMENTO DE ERROS (sempre no final)
export const errorMiddleware = (err, req, res, next) => {
    console.error('❌ Erro:', err.stack);
    
    res.status(err.status || 500).json({
        message: err.message || 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

// 7. MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS
export const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        message: `Rota ${req.method} ${req.url} não encontrada`
    });
};

// ====================================
// COMO USAR MIDDLEWARES
// ====================================

/*
// No app.js:

// Middleware GLOBAL (aplica em todas as rotas)
app.use(logMiddleware);
app.use(corsMiddleware);

// Middleware em ROTA ESPECÍFICA
app.post('/usuarios', authMiddleware, validarDadosMiddleware, UsuarioController.criar);

// Middleware de ERRO (sempre por último)
app.use(errorMiddleware);
app.use(notFoundMiddleware);
*/

// ====================================
// ORDEM DE EXECUÇÃO DOS MIDDLEWARES
// ====================================

/*
Exemplo: POST /usuarios

1. logMiddleware          -> loga a requisição
2. corsMiddleware         -> configura CORS
3. express.json()         -> parse do JSON
4. authMiddleware         -> verifica autenticação
5. validarDadosMiddleware -> valida dados
6. UsuarioController      -> executa o controller
7. tempoRespostaMiddleware -> calcula tempo
8. res.json()             -> envia resposta

Se algum middleware não chamar next(), a cadeia para!
*/
