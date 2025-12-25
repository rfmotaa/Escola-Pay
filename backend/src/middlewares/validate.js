import { HttpErrors } from './errorHandler.js';

/**
 * Simple validation middleware factory
 * 
 * Validates request body against a schema object
 * Schema format: { fieldName: { required: boolean, type: string, min: number, max: number } }
 * 
 * @param {Object} schema - Validation schema
 * @returns {Function} Express middleware
 * 
 * @example
 * router.post('/users', validate({
 *   nome: { required: true, type: 'string', min: 2 },
 *   email: { required: true, type: 'string' },
 *   idade: { required: false, type: 'number', min: 0 }
 * }), controller.create);
 */
export const validate = (schema) => (req, res, next) => {
  const errors = [];
  const body = req.body || {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = body[field];

    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} é obrigatório`);
      continue;
    }

    // Skip validation if not required and not provided
    if (value === undefined || value === null) continue;

    // Check type
    if (rules.type) {
      const actualType = typeof value;
      if (rules.type === 'number' && actualType !== 'number') {
        errors.push(`${field} deve ser um número`);
      } else if (rules.type === 'string' && actualType !== 'string') {
        errors.push(`${field} deve ser uma string`);
      } else if (rules.type === 'boolean' && actualType !== 'boolean') {
        errors.push(`${field} deve ser um booleano`);
      } else if (rules.type === 'email' && !isValidEmail(value)) {
        errors.push(`${field} deve ser um email válido`);
      }
    }

    // Check min length/value
    if (rules.min !== undefined) {
      if (typeof value === 'string' && value.length < rules.min) {
        errors.push(`${field} deve ter pelo menos ${rules.min} caracteres`);
      } else if (typeof value === 'number' && value < rules.min) {
        errors.push(`${field} deve ser no mínimo ${rules.min}`);
      }
    }

    // Check max length/value
    if (rules.max !== undefined) {
      if (typeof value === 'string' && value.length > rules.max) {
        errors.push(`${field} deve ter no máximo ${rules.max} caracteres`);
      } else if (typeof value === 'number' && value > rules.max) {
        errors.push(`${field} deve ser no máximo ${rules.max}`);
      }
    }
  }

  if (errors.length > 0) {
    return next(HttpErrors.validation(errors.join(', ')));
  }

  next();
};

/**
 * Email validation helper
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Common validation schemas for reuse
 */
export const schemas = {
  usuario: {
    create: {
      nome: { required: true, type: 'string', min: 2, max: 100 },
      email: { required: true, type: 'email' },
      senha: { required: true, type: 'string', min: 6 },
      telefone: { required: false, type: 'string' }
    },
    login: {
      email: { required: true, type: 'email' },
      senha: { required: true, type: 'string' }
    }
  },
  compra: {
    create: {
      id_estabelecimento: { required: true, type: 'number' },
      id_usuario_responsavel: { required: true, type: 'number' },
      nome_compra: { required: true, type: 'string', min: 2 },
      valor_total: { required: true, type: 'number', min: 0 }
    }
  },
  mensalidade: {
    create: {
      id_estabelecimento: { required: true, type: 'number' },
      id_pagador: { required: true, type: 'number' },
      valor: { required: true, type: 'number', min: 0 },
      data_vencimento: { required: true, type: 'string' }
    }
  },
  estabelecimento: {
    create: {
      id_criador: { required: true, type: 'number' },
      nome: { required: true, type: 'string', min: 2 }
    }
  }
};
