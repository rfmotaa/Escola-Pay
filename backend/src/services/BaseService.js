import { HttpErrors } from '../middlewares/errorHandler.js';
import { Op } from 'sequelize';

/**
 * Base Service class with common CRUD operations
 * Reduces code duplication across all services
 * 
 * @abstract
 */
export class BaseService {
  /**
   * @param {Model} model - Sequelize model
   * @param {string} resourceName - Name for error messages
   * @param {string} primaryKey - Primary key field name
   */
  constructor(model, resourceName, primaryKey = 'id') {
    this.model = model;
    this.resourceName = resourceName;
    this.primaryKey = primaryKey;
  }

  /**
   * Find all records with optional filters
   */
  async findAll(where = {}, options = {}) {
    return this.model.findAll({ where, ...options });
  }

  /**
   * Find record by primary key
   * @throws {AppError} 404 if not found
   */
  async findById(id, options = {}) {
    const record = await this.model.findByPk(id, options);
    if (!record) {
      throw HttpErrors.notFound(this.resourceName);
    }
    return record;
  }

  /**
   * Find single record by conditions
   */
  async findOne(where, options = {}) {
    const record = await this.model.findOne({ where, ...options });
    if (!record) {
      throw HttpErrors.notFound(this.resourceName);
    }
    return record;
  }

  /**
   * Create new record
   */
  async create(data) {
    return this.model.create(data);
  }

  /**
   * Update existing record
   * @throws {AppError} 404 if not found
   */
  async update(id, data) {
    const [updated] = await this.model.update(data, {
      where: { [this.primaryKey]: id }
    });

    if (updated === 0) {
      throw HttpErrors.notFound(this.resourceName);
    }

    return this.findById(id);
  }

  /**
   * Delete record by ID
   * @throws {AppError} 404 if not found
   */
  async delete(id) {
    const deleted = await this.model.destroy({
      where: { [this.primaryKey]: id }
    });

    if (deleted === 0) {
      throw HttpErrors.notFound(this.resourceName);
    }

    return true;
  }

  /**
   * Filter by establishment and date range
   * Common pattern used by Compra, Mensalidade, etc.
   */
  buildDateFilter(estabelecimentoId, mes, ano, dateField = 'createdAt') {
    const where = {};

    if (estabelecimentoId) {
      where.id_estabelecimento = estabelecimentoId;
    }

    if (mes && ano) {
      const mesNum = parseInt(mes);
      const anoNum = parseInt(ano);
      const dataInicio = new Date(anoNum, mesNum - 1, 1);
      const dataFim = new Date(anoNum, mesNum, 0);

      where[dateField] = {
        [Op.between]: [dataInicio, dataFim]
      };
    }

    return where;
  }
}
