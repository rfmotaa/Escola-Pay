const schemas = {
    Usuario: {
        id_usuario: false,
        id_estabelecimento: true,
        nome: true,
        email: true,
        senha: true,
        ativo: false
    }
};

export const validate = (className, body) => {
    const schema = schemas[className];
    
    if (!schema) return false;
    for (const key in schema) {
        if (schema[key] && !body.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};
