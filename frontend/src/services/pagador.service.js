import api from './api';

export const pagadorService = {
  async listar() {
    const response = await api.get('/pagadores');
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/pagadores/${id}`);
    return response.data;
  },

  async criar(dados) {
    const response = await api.post('/pagadores', dados);
    return response.data.pagador;
  },

  async atualizar(id, dados) {
    const response = await api.put(`/pagadores/${id}`, dados);
    return response.data.pagador;
  },

  async deletar(id) {
    const response = await api.delete(`/pagadores/${id}`);
    return response.data;
  },
};
