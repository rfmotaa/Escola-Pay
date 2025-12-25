import { BaseService } from './BaseService.js';
import Compra from '../models/Compra.js';

class CompraService extends BaseService {
  constructor() {
    super(Compra, 'Compra', 'id_compra');
  }

  /**
   * List compras with optional filters
   */
  async listar({ id_estabelecimento, mes, ano } = {}) {
    const where = this.buildDateFilter(id_estabelecimento, mes, ano, 'data_compra');
    
    return this.findAll(where, {
      order: [['data_compra', 'DESC']]
    });
  }

  /**
   * Create new compra with validation
   */
  async criar(data) {
    // Business validation can be added here
    return this.create(data);
  }

  /**
   * Update compra
   */
  async atualizar(id, data) {
    return this.update(id, data);
  }

  /**
   * Delete compra
   */
  async deletar(id) {
    return this.delete(id);
  }

  /**
   * Get compra by ID
   */
  async buscarPorId(id) {
    return this.findById(id);
  }
}

// Export singleton instance
export const compraService = new CompraService();
