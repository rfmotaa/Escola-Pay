import api from './api';

export const authService = {
  async login(email, senha) {
    const response = await api.post('/usuarios/login', { email, senha });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
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
    window.location.href = '/';
  },

  getUsuarioLogado() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  isAutenticado() {
    return !!localStorage.getItem('token');
  },
};
