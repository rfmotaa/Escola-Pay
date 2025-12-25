import api from './api';

export const compraService = {
  async listar(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.id_estabelecimento) queryParams.append('id_estabelecimento', params.id_estabelecimento);
    if (params.mes) queryParams.append('mes', params.mes);
    if (params.ano) queryParams.append('ano', params.ano);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/compras?${queryString}` : '/compras';
    const response = await api.get(url);
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
