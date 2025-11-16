import api from './api';

export const authService = {
  async login(email, senha) {
    const response = await api.post('/usuarios/login', { email, senha });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

      try {
        const estabelecimentosResponse = await api.get(`/estabelecimentos/usuario/${response.data.usuario.id_usuario}`);
        const estabelecimentos = estabelecimentosResponse.data;
        
        if (estabelecimentos && estabelecimentos.length > 0) {
          localStorage.setItem('temEstabelecimento', 'true');
          localStorage.setItem('estabelecimento', JSON.stringify(estabelecimentos[0]));
        } else {
          localStorage.setItem('temEstabelecimento', 'false');
          localStorage.removeItem('estabelecimento');
        }
      } catch (err) {
        localStorage.setItem('temEstabelecimento', 'false');
        localStorage.removeItem('estabelecimento');
      }
    }
    return response.data;
  },

  async cadastrar(dados) {
    const response = await api.post('/usuarios', dados);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('temEstabelecimento');
    localStorage.removeItem('estabelecimento');
    window.location.href = '/';
  },

  getUsuarioLogado() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  isAutenticado() {
    return !!localStorage.getItem('token');
  },

  getTemEstabelecimento() {
    return localStorage.getItem('temEstabelecimento') === 'true';
  },

  getEstabelecimento() {
    const estabelecimento = localStorage.getItem('estabelecimento');
    return estabelecimento ? JSON.parse(estabelecimento) : null;
  },
};
