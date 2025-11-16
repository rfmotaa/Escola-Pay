import api from './api';

export const itemCompraService = {
  async listar(id_compra) {
    // Buscar itens de uma compra específica via query ou filtro no controller
    const response = await api.get(`/itens-compra?id_compra=${id_compra}`);
    return response.data;
  },

  async criar(id_compra, dados) {
    // Incluir id_compra no corpo da requisição ao invés da URL
    const response = await api.post(`/itens-compra`, { ...dados, id_compra });
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/itens-compra/${id}`);
    return response.data;
  },

  async atualizar(id, dados) {
    const response = await api.put(`/itens-compra/${id}`, dados);
    return response.data;
  },

  async deletar(id) {
    const response = await api.delete(`/itens-compra/${id}`);
    return response.data;
  },
};
