/**
 * @fileoverview Página de Compras refatorada
 * 
 * Melhorias:
 * - Usa layout compartilhado
 * - Skeleton loading
 * - Recebe data do contexto
 */

import { useOutletContext } from 'react-router-dom';
import { Button } from '../components/dashboard.ui/button';
import { Plus } from 'lucide-react';
import { useCompras } from '../hooks/useCompras';
import { ComprasStats, ComprasFilters, ComprasList } from '../components/compras';
import { PageListSkeleton } from '../components/LoadingSkeletons';
import CompraModal from '../components/CompraModal';
import ItensCompraModal from '../components/ItensCompraModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/dashboard.ui/alert-dialog';

/**
 * Compras Page - Refactored version
 * Uses shared layout from DashboardLayout
 */
export default function Compras() {
  const { selectedDate } = useOutletContext();
  
  const {
    // State
    compras,
    filteredCompras,
    loading,
    searchTerm,
    categoriaFilter,
    currentPage,
    stats,
    pagination,
    
    // Modal state
    modalOpen,
    setModalOpen,
    itensModalOpen,
    setItensModalOpen,
    editingCompra,
    viewingCompra,
    deleteDialogOpen,
    setDeleteDialogOpen,

    // Actions
    setSearchTerm,
    setCategoriaFilter,
    handleDateChange,
    handleAddCompra,
    handleEditCompra,
    handleViewItens,
    handleDeleteClick,
    handleDeleteConfirm,
    handleSaveCompra,
    goToNextPage,
    goToPrevPage
  } = useCompras(selectedDate);

  if (loading) {
    return <PageListSkeleton statsCount={3} itemsCount={6} />;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
              Gerenciar Compras
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Controle de compras e despesas do estabelecimento
            </p>
          </div>
        </div>

        {/* Statistics */}
        <ComprasStats
          totalMes={stats.totalMes}
          numComprasMes={stats.numComprasMes}
          compraMaisCara={stats.compraMaisCara}
          totalCompras={compras.length}
        />

        {/* Filters */}
        <ComprasFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoriaFilter={categoriaFilter}
          onCategoriaChange={setCategoriaFilter}
        />

        {/* List */}
        <ComprasList
          compras={filteredCompras}
          pagination={pagination}
          searchTerm={searchTerm}
          categoriaFilter={categoriaFilter}
          currentPage={currentPage}
          onAddCompra={handleAddCompra}
          onEditCompra={handleEditCompra}
          onDeleteCompra={handleDeleteClick}
          onViewItens={handleViewItens}
          onNextPage={goToNextPage}
          onPrevPage={goToPrevPage}
        />
      </div>

      {/* FAB Button */}
      <Button
        onClick={handleAddCompra}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-transform hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Modals */}
      <CompraModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        compra={editingCompra}
        onSave={handleSaveCompra}
      />

      <ItensCompraModal
        open={itensModalOpen}
        onOpenChange={setItensModalOpen}
        compra={viewingCompra}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Tem certeza que deseja remover esta compra e todos os seus itens?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
