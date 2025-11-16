import api from './api';

export const estabelecimentoService = {
  async listar() {
    const response = await api.get('/estabelecimentos');
    return response.data;
  },

  async listarDoUsuario(idUsuario) {
    const response = await api.get(`/estabelecimentos/usuario/${idUsuario}`);
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/estabelecimentos/${id}`);
    return response.data;
  },

  async criar(dados) {
    const response = await api.post('/estabelecimentos', dados);
    return response.data;
  },

  async atualizar(id, dados) {
    const response = await api.put(`/estabelecimentos/${id}`, dados);
    return response.data;
  },

  async deletar(id) {
    const response = await api.delete(`/estabelecimentos/${id}`);
    return response.data;
  },
};
