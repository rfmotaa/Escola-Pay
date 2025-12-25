import { BaseService } from './BaseService.js';
import Usuario from '../models/Usuario.js';
import { CryptoManager } from '../config/crypto.js';
import { HttpErrors } from '../middlewares/errorHandler.js';
import jwt from 'jsonwebtoken';

/**
 * Attributes to exclude from user responses (security)
 */
const EXCLUDED_ATTRIBUTES = ['senha'];

/**
 * Safe user attributes for responses
 */
const SAFE_ATTRIBUTES = ['id_usuario', 'nome', 'email', 'telefone', 'ativo', 'data_cadastro'];

class UsuarioService extends BaseService {
  constructor() {
    super(Usuario, 'Usuário', 'id_usuario');
  }

  /**
   * List all users (without passwords)
   */
  async listar() {
    return this.findAll({}, {
      attributes: { exclude: EXCLUDED_ATTRIBUTES }
    });
  }

  /**
   * Create new user with password hashing
   */
  async criar(data) {
    const { nome, email, senha, telefone } = data;

    if (!nome || !email || !senha) {
      throw HttpErrors.validation('Nome, email e senha são obrigatórios');
    }

    // Check if email already exists
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      throw HttpErrors.conflict('Email já cadastrado');
    }

    const userData = {
      nome,
      email,
      senha: await CryptoManager.generateHash(senha),
      ...(telefone && telefone !== '' && { telefone })
    };

    const novoUsuario = await this.create(userData);

    // Return safe user object
    return {
      id_usuario: novoUsuario.id_usuario,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      telefone: novoUsuario.telefone,
      ativo: novoUsuario.ativo,
      data_cadastro: novoUsuario.data_cadastro
    };
  }

  /**
   * Authenticate user and generate JWT
   */
  async login(email, senha) {
    if (!email || !senha) {
      throw HttpErrors.validation('Email e senha são obrigatórios');
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      throw HttpErrors.notFound('Usuário');
    }

    const senhaValida = await CryptoManager.compareHash(senha, usuario.senha);
    if (!senhaValida) {
      throw HttpErrors.unauthorized('Senha incorreta');
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        nome: usuario.nome
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email
      }
    };
  }

  /**
   * Get user by ID (without password)
   */
  async buscarPorId(id) {
    return this.findById(id, {
      attributes: { exclude: EXCLUDED_ATTRIBUTES }
    });
  }

  /**
   * Update user (hash password if changed)
   */
  async atualizar(id, data) {
    if (data.senha) {
      data.senha = await CryptoManager.generateHash(data.senha);
    }

    const [updated] = await Usuario.update(data, {
      where: { id_usuario: id }
    });

    if (updated === 0) {
      throw HttpErrors.notFound('Usuário');
    }

    return this.buscarPorId(id);
  }

  /**
   * Delete user
   */
  async deletar(id) {
    return this.delete(id);
  }
}

export const usuarioService = new UsuarioService();
