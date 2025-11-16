import api from './api';

export const mensalidadeService = {
  async listar() {
    const response = await api.get('/mensalidades');
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/mensalidades/${id}`);
    return response.data;
  },

  async criar(dados) {
    const response = await api.post('/mensalidades', dados);
    return response.data;
  },

  async atualizar(id, dados) {
    const response = await api.put(`/mensalidades/${id}`, dados);
    return response.data;
  },

  async deletar(id) {
    const response = await api.delete(`/mensalidades/${id}`);
    return response.data;
  },
};
