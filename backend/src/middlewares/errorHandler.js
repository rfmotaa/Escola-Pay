/**
 * Custom error class for API errors
 * Allows setting HTTP status codes and error codes
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common HTTP error factory functions
 */
export const HttpErrors = {
  badRequest: (message = 'Requisição inválida') => 
    new AppError(message, 400, 'BAD_REQUEST'),
  
  unauthorized: (message = 'Não autorizado') => 
    new AppError(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message = 'Acesso negado') => 
    new AppError(message, 403, 'FORBIDDEN'),
  
  notFound: (resource = 'Recurso') => 
    new AppError(`${resource} não encontrado`, 404, 'NOT_FOUND'),
  
  conflict: (message = 'Conflito de dados') => 
    new AppError(message, 409, 'CONFLICT'),
  
  validation: (message = 'Dados inválidos') => 
    new AppError(message, 422, 'VALIDATION_ERROR'),
};

/**
 * Async handler wrapper - eliminates try-catch boilerplate in controllers
 * 
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware
 * 
 * @example
 * // Before: 50+ lines with try-catch
 * // After: Clean, focused logic
 * static listar = asyncHandler(async (req, res) => {
 *   const items = await Service.findAll();
 *   res.json(items);
 * });
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Central error handling middleware
 * Must be registered LAST in Express middleware chain
 */
export const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor';
  let code = err.code || 'INTERNAL_ERROR';

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 422;
    code = 'VALIDATION_ERROR';
    message = err.errors.map(e => e.message).join(', ');
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    code = 'DUPLICATE_ERROR';
    message = 'Registro duplicado';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Token inválido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Token expirado';
  }

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${code}] ${message}`, err.stack);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    code,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  next(HttpErrors.notFound(`Rota ${req.originalUrl}`));
};
