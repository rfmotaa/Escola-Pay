import api from './api';

export const mensalidadeService = {
  async listar(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.id_estabelecimento) queryParams.append('id_estabelecimento', params.id_estabelecimento);
    if (params.mes) queryParams.append('mes', params.mes);
    if (params.ano) queryParams.append('ano', params.ano);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/mensalidades?${queryString}` : '/mensalidades';
    const response = await api.get(url);
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
