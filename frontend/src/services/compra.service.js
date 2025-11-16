import api from './api';

export const compraService = {
  async listar() {
    const response = await api.get('/compras');
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/compras/${id}`);
    return response.data;
  },

  async criar(dados) {
    const response = await api.post('/compras', dados);
    return response.data;
  },

  async atualizar(id, dados) {
    const response = await api.put(`/compras/${id}`, dados);
    return response.data;
  },

  async deletar(id) {
    const response = await api.delete(`/compras/${id}`);
    return response.data;
  },
};
