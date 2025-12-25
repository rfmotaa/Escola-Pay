import { useState, useEffect, useCallback, useMemo } from 'react';
import { compraService } from '../services/compra.service';
import { authService } from '../services/auth.service';
import { toast } from 'sonner';

/**
 * Custom hook for managing Compras state and logic
 * Extracts all business logic from the component
 * 
 * @param {Date} [externalDate] - Optional date from parent context
 * 
 * Benefits:
 * - Testable in isolation
 * - Reusable across components
 * - Clear separation of concerns
 * - Reduced component complexity
 */
export function useCompras(externalDate) {
  // Core state
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [internalDate, setInternalDate] = useState(() => new Date());
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use external date if provided, otherwise use internal
  const dataSelecionada = externalDate || internalDate;
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [itensModalOpen, setItensModalOpen] = useState(false);
  const [editingCompra, setEditingCompra] = useState(null);
  const [viewingCompra, setViewingCompra] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compraToDelete, setCompraToDelete] = useState(null);

  const itemsPerPage = 9;
  const estabelecimento = authService.getEstabelecimento();

  /**
   * Load compras from API
   */
  const carregarCompras = useCallback(async () => {
    try {
      setLoading(true);
      const data = await compraService.listar({
        id_estabelecimento: estabelecimento?.id_estabelecimento
      });
      setCompras(data);
    } catch (err) {
      console.error('Erro ao carregar compras:', err);
      toast.error('Erro ao carregar compras');
    } finally {
      setLoading(false);
    }
  }, [estabelecimento?.id_estabelecimento]);

  /**
   * Filter compras by date, category, and search term
   */
  const filteredCompras = useMemo(() => {
    let filtered = [...compras];

    // Filter by selected month/year
    if (dataSelecionada) {
      const selectedMonth = dataSelecionada.getMonth();
      const selectedYear = dataSelecionada.getFullYear();
      filtered = filtered.filter((c) => {
        const date = new Date(c.data_compra);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      });
    }

    // Filter by category
    if (categoriaFilter !== 'todas') {
      filtered = filtered.filter((c) => c.categoria === categoriaFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((c) =>
        c.nome_compra?.toLowerCase().includes(term) ||
        c.descricao?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [compras, dataSelecionada, categoriaFilter, searchTerm]);

  /**
   * Calculate statistics for current month
   */
  const stats = useMemo(() => {
    const comprasDoMes = filteredCompras;
    const totalMes = comprasDoMes.reduce((sum, c) => sum + parseFloat(c.valor_total || 0), 0);
    const numComprasMes = comprasDoMes.length;
    const compraMaisCara = comprasDoMes.length > 0
      ? Math.max(...comprasDoMes.map((c) => parseFloat(c.valor_total || 0)))
      : 0;

    return { totalMes, numComprasMes, compraMaisCara };
  }, [filteredCompras]);

  /**
   * Pagination logic
   */
  const pagination = useMemo(() => {
    const totalPages = Math.ceil(filteredCompras.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCompras = filteredCompras.slice(startIndex, startIndex + itemsPerPage);

    return {
      totalPages,
      startIndex,
      paginatedCompras,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }, [filteredCompras, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoriaFilter, dataSelecionada]);

  // Load compras on mount
  useEffect(() => {
    carregarCompras();
  }, [carregarCompras]);

  // Action handlers
  const handleDateChange = useCallback((date) => {
    setInternalDate(date);
  }, []);

  const handleAddCompra = useCallback(() => {
    setEditingCompra(null);
    setModalOpen(true);
  }, []);

  const handleEditCompra = useCallback((compra) => {
    setEditingCompra(compra);
    setModalOpen(true);
  }, []);

  const handleViewItens = useCallback((compra) => {
    setViewingCompra(compra);
    setItensModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((compra) => {
    setCompraToDelete(compra);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await compraService.deletar(compraToDelete.id_compra);
      toast.success('Compra removida com sucesso!');
      setDeleteDialogOpen(false);
      setCompraToDelete(null);
      carregarCompras();
    } catch (err) {
      console.error('Erro ao deletar compra:', err);
      toast.error('Erro ao remover compra');
    }
  }, [compraToDelete, carregarCompras]);

  const handleSaveCompra = useCallback(async () => {
    setModalOpen(false);
    await carregarCompras();
  }, [carregarCompras]);

  const goToNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(pagination.totalPages, p + 1));
  }, [pagination.totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  return {
    // State
    compras,
    filteredCompras,
    loading,
    searchTerm,
    categoriaFilter,
    dataSelecionada,
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
    compraToDelete,

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
    goToPrevPage,
    carregarCompras
  };
}
