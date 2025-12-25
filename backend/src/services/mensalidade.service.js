import { BaseService } from './BaseService.js';
import Mensalidade from '../models/Mensalidade.js';

class MensalidadeService extends BaseService {
  constructor() {
    super(Mensalidade, 'Mensalidade', 'id_mensalidade');
  }

  /**
   * List mensalidades with optional filters
   */
  async listar({ id_estabelecimento, mes, ano } = {}) {
    const where = this.buildDateFilter(id_estabelecimento, mes, ano, 'data_vencimento');
    
    return this.findAll(where, {
      order: [['data_vencimento', 'DESC']]
    });
  }

  /**
   * Create new mensalidade
   */
  async criar(data) {
    return this.create(data);
  }

  /**
   * Update mensalidade
   */
  async atualizar(id, data) {
    return this.update(id, data);
  }

  /**
   * Delete mensalidade
   */
  async deletar(id) {
    return this.delete(id);
  }

  /**
   * Get mensalidade by ID
   */
  async buscarPorId(id) {
    return this.findById(id);
  }
}

export const mensalidadeService = new MensalidadeService();
