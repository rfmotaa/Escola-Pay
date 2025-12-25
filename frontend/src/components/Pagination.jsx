/**
 * @fileoverview Componente de paginação reutilizável
 * @module components/Pagination
 * 
 * @description
 * Componente visual de paginação que trabalha com o hook usePagination.
 * Separação clara entre lógica (hook) e apresentação (componente).
 */

import { Button } from './dashboard.ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Componente de controles de paginação
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Página atual
 * @param {number} props.totalPages - Total de páginas
 * @param {number} props.startIndex - Índice inicial (0-based)
 * @param {number} props.endIndex - Índice final
 * @param {number} props.totalItems - Total de itens
 * @param {boolean} props.canGoNext - Se pode ir para próxima
 * @param {boolean} props.canGoPrev - Se pode ir para anterior
 * @param {Function} props.onNext - Callback para próxima página
 * @param {Function} props.onPrev - Callback para página anterior
 * @param {string} [props.itemLabel='itens'] - Label para itens (ex: 'mensalidades')
 */
export function Pagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  itemLabel = 'itens',
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="border-slate-700 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 transition-opacity"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-slate-400 text-sm px-4 tabular-nums">
          Página {currentPage} de {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!canGoNext}
          className="border-slate-700 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 transition-opacity"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-center text-slate-500 text-sm tabular-nums">
        Mostrando {startIndex + 1}-{endIndex} de {totalItems} {itemLabel}
      </p>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  canGoNext: PropTypes.bool.isRequired,
  canGoPrev: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  itemLabel: PropTypes.string,
};
