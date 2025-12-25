import { compraService } from '../services/compra.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * CompraController - Handles HTTP layer only
 * Business logic delegated to CompraService
 * 
 * Complexity reduced from ~100 lines to ~40 lines
 * - Removed try-catch blocks (handled by asyncHandler)
 * - Removed business logic (moved to service)
 * - Single responsibility: HTTP handling only
 */
class CompraController {

  static listarCompras = asyncHandler(async (req, res) => {
    const compras = await compraService.listar(req.query);
    res.status(200).json(compras);
  });

  static cadastrarCompra = asyncHandler(async (req, res) => {
    const novaCompra = await compraService.criar(req.body);
    res.status(201).json({
      message: 'Compra criada com sucesso',
      compra: novaCompra
    });
  });

  static buscarCompraPorId = asyncHandler(async (req, res) => {
    const compra = await compraService.buscarPorId(req.params.id);
    res.status(200).json(compra);
  });

  static atualizarCompra = asyncHandler(async (req, res) => {
    const compraAtualizada = await compraService.atualizar(req.params.id, req.body);
    res.status(200).json({
      message: 'Compra atualizada com sucesso',
      compra: compraAtualizada
    });
  });

  static deletarCompra = asyncHandler(async (req, res) => {
    await compraService.deletar(req.params.id);
    res.status(200).json({ message: 'Compra deletada com sucesso' });
  });
}

export default CompraController;
