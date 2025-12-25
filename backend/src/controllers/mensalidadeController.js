import { mensalidadeService } from '../services/mensalidade.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * MensalidadeController - HTTP layer only
 * 
 * Complexity reduced from ~100 lines to ~40 lines
 */
class MensalidadeController {

  static listarMensalidades = asyncHandler(async (req, res) => {
    const mensalidades = await mensalidadeService.listar(req.query);
    res.status(200).json(mensalidades);
  });

  static cadastrarMensalidade = asyncHandler(async (req, res) => {
    const novaMensalidade = await mensalidadeService.criar(req.body);
    res.status(201).json({
      message: 'Mensalidade criada com sucesso',
      mensalidade: novaMensalidade
    });
  });

  static buscarMensalidadePorId = asyncHandler(async (req, res) => {
    const mensalidade = await mensalidadeService.buscarPorId(req.params.id);
    res.status(200).json(mensalidade);
  });

  static atualizarMensalidade = asyncHandler(async (req, res) => {
    const mensalidadeAtualizada = await mensalidadeService.atualizar(req.params.id, req.body);
    res.status(200).json({
      message: 'Mensalidade atualizada com sucesso',
      mensalidade: mensalidadeAtualizada
    });
  });

  static deletarMensalidade = asyncHandler(async (req, res) => {
    await mensalidadeService.deletar(req.params.id);
    res.status(200).json({ message: 'Mensalidade deletada com sucesso' });
  });
}

export default MensalidadeController;
