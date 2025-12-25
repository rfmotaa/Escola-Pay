import { Card, CardContent } from '../dashboard.ui/card';
import { Button } from '../dashboard.ui/button';
import { ShoppingCart, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import CompraCard from './CompraCard';

/**
 * ComprasList - Grid of compras with pagination
 * 
 * Single Responsibility: Renders the list of compras with pagination
 */
export default function ComprasList({
  compras,
  pagination,
  searchTerm,
  categoriaFilter,
  onAddCompra,
  onEditCompra,
  onDeleteCompra,
  onViewItens,
  onNextPage,
  onPrevPage,
  currentPage
}) {
  const { paginatedCompras, totalPages, startIndex } = pagination;
  const hasFilters = searchTerm || categoriaFilter !== 'todas';

  // Empty state
  if (compras.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-16 w-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {hasFilters ? 'Nenhuma compra encontrada' : 'Nenhuma compra cadastrada'}
          </h3>
          <p className="text-slate-400 mb-6">
            {hasFilters ? 'Tente ajustar os filtros' : 'Comece registrando sua primeira compra'}
          </p>
          {!hasFilters && (
            <Button
              onClick={onAddCompra}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Compra
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedCompras.map((compra) => (
          <CompraCard
            key={compra.id_compra}
            compra={compra}
            onEdit={onEditCompra}
            onDelete={onDeleteCompra}
            onViewItens={onViewItens}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="border-slate-700 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-slate-400 text-sm px-4">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="border-slate-700 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <p className="text-center text-slate-500 text-sm mt-2">
        Mostrando {startIndex + 1}-{Math.min(startIndex + 9, compras.length)} de {compras.length} compras
      </p>
    </>
  );
}
