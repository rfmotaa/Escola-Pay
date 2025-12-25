import { usuarioService } from '../services/usuario.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * UsuarioController - HTTP layer only
 * 
 * Complexity reduced from ~150 lines to ~50 lines
 * - All business logic in UsuarioService
 * - Password never returned in responses
 * - Clean, testable code
 */
class UsuarioController {

  static listarUsuarios = asyncHandler(async (req, res) => {
    const usuarios = await usuarioService.listar();
    res.status(200).json(usuarios);
  });

  static cadastrarUsuario = asyncHandler(async (req, res) => {
    const novoUsuario = await usuarioService.criar(req.body);
    res.status(201).json({
      message: 'Usuário criado com sucesso! Agora você pode criar seu estabelecimento.',
      usuario: novoUsuario
    });
  });

  static login = asyncHandler(async (req, res) => {
    const { email, senha } = req.body;
    const result = await usuarioService.login(email, senha);
    res.status(200).json({
      message: 'Usuário logado com sucesso',
      ...result
    });
  });

  static buscarUsuarioPorId = asyncHandler(async (req, res) => {
    const usuario = await usuarioService.buscarPorId(req.params.id);
    res.status(200).json(usuario);
  });

  static atualizarUsuario = asyncHandler(async (req, res) => {
    const usuarioAtualizado = await usuarioService.atualizar(req.params.id, req.body);
    res.status(200).json({
      message: 'Usuário atualizado com sucesso',
      usuario: usuarioAtualizado
    });
  });

  static deletarUsuario = asyncHandler(async (req, res) => {
    await usuarioService.deletar(req.params.id);
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  });
}

export default UsuarioController;
