/**
 * @fileoverview Página de Mensalidades refatorada
 * 
 * Melhorias:
 * - Usa layout compartilhado (sem duplicar sidebar/wrapper)
 * - Hook usePagination para paginação consistente
 * - Skeleton loading para melhor UX
 * - Transições suaves nos cards
 * - Recebe data do contexto compartilhado
 */

import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { mensalidadeService } from "../services/mensalidade.service";
import { pagadorService } from "../services/pagador.service";
import { authService } from "../services/auth.service";
import { Button } from "../components/dashboard.ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/dashboard.ui/card";
import { Input } from "../components/dashboard.ui/input";
import { Badge } from "../components/dashboard.ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/dashboard.ui/select";
import { toast } from "sonner";
import { DollarSign, Plus, Edit, Trash2, CheckCircle, Search, Calendar, User } from "lucide-react";
import MensalidadeModal from "../components/MensalidadeModal";
import { Pagination } from "../components/Pagination";
import { PageListSkeleton } from "../components/LoadingSkeletons";
import { usePagination } from "../hooks/usePagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/dashboard.ui/alert-dialog";

const ITEMS_PER_PAGE = 9;

export default function Mensalidades() {
  const { selectedDate } = useOutletContext<{ selectedDate: Date }>();
  
  const [mensalidades, setMensalidades] = useState<any[]>([]);
  const [pagadores, setPagadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [pagadorFilter, setPagadorFilter] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMensalidade, setEditingMensalidade] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mensalidadeToDelete, setMensalidadeToDelete] = useState<any>(null);

  const estabelecimento = authService.getEstabelecimento();

  useEffect(() => {
    carregarDados();
  }, []);

  // Filtrar mensalidades com base em todos os critérios
  const filteredMensalidades = useMemo(() => {
    let filtered = [...mensalidades];

    // Filtrar por mês/ano selecionado
    if (selectedDate) {
      const selectedMonth = selectedDate.getMonth();
      const selectedYear = selectedDate.getFullYear();
      filtered = filtered.filter((m: any) => {
        const date = new Date(m.data_vencimento);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      });
    }

    if (statusFilter !== "todas") {
      filtered = filtered.filter((m) => m.status === statusFilter);
    }

    if (pagadorFilter !== "todos") {
      filtered = filtered.filter((m) => m.id_pagador === parseInt(pagadorFilter));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.nome_mensalidade?.toLowerCase().includes(term) ||
          m.descricao?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [mensalidades, selectedDate, statusFilter, pagadorFilter, searchTerm]);

  // Hook de paginação - reseta automaticamente quando filteredMensalidades muda
  const pagination = usePagination({
    items: filteredMensalidades,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [mensalidadesData, pagadoresData] = await Promise.all([
        mensalidadeService.listar(),
        pagadorService.listar(),
      ]);

      const pagadoresDoEstabelecimento = pagadoresData.filter(
        (p: any) => p.id_estabelecimento === estabelecimento?.id_estabelecimento
      );
      
      setPagadores(pagadoresDoEstabelecimento);
      setMensalidades(mensalidadesData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      toast.error("Erro ao carregar mensalidades");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMensalidade = () => {
    setEditingMensalidade(null);
    setModalOpen(true);
  };

  const handleEditMensalidade = (mensalidade: any) => {
    setEditingMensalidade(mensalidade);
    setModalOpen(true);
  };

  const handleDeleteClick = (mensalidade: any) => {
    setMensalidadeToDelete(mensalidade);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await mensalidadeService.deletar(mensalidadeToDelete.id_mensalidade);
      toast.success("Mensalidade removida com sucesso!");
      setDeleteDialogOpen(false);
      setMensalidadeToDelete(null);
      carregarDados();
    } catch (err) {
      console.error("Erro ao deletar mensalidade:", err);
      toast.error("Erro ao remover mensalidade");
    }
  };

  const handleMarcarPaga = async (mensalidade: any) => {
    try {
      await mensalidadeService.atualizar(mensalidade.id_mensalidade, {
        ...mensalidade,
        status: "paga",
      });
      toast.success("Mensalidade marcada como paga!");
      carregarDados();
    } catch (err) {
      console.error("Erro ao atualizar mensalidade:", err);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleSaveMensalidade = async () => {
    setModalOpen(false);
    await carregarDados();
  };

  const getPagadorNome = (id_pagador: any) => {
    const pagador = pagadores.find((p) => p.id_pagador === id_pagador);
    return pagador?.nome || "Desconhecido";
  };

  const getStatusBadge = (status: "pendente" | "paga" | "atrasada") => {
    const configs = {
      pendente: { label: "Pendente", className: "bg-amber-500/20 text-amber-400 border-amber-500/50" },
      paga: { label: "Paga", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" },
      atrasada: { label: "Atrasada", className: "bg-red-500/20 text-red-400 border-red-500/50" },
    };
    const config = configs[status] || configs.pendente;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Cálculos de estatísticas
  const stats = useMemo(() => {
    const pendentes = filteredMensalidades.filter((m) => m.status === "pendente");
    const pagas = filteredMensalidades.filter((m) => m.status === "paga");
    const atrasadas = filteredMensalidades.filter((m) => m.status === "atrasada");

    return {
      totalReceber: pendentes.reduce((sum, m) => sum + parseFloat(m.valor), 0),
      totalRecebido: pagas.reduce((sum, m) => sum + parseFloat(m.valor), 0),
      totalAtrasado: atrasadas.reduce((sum, m) => sum + parseFloat(m.valor), 0),
      countPendentes: pendentes.length,
      countPagas: pagas.length,
      countAtrasadas: atrasadas.length,
    };
  }, [filteredMensalidades]);

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
              Gerenciar Mensalidades
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Controle de pagamentos e recebimentos
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm card-enter">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total a Receber
              </CardTitle>
              <DollarSign className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400 tabular-nums">
                R$ {stats.totalReceber.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.countPendentes} pendentes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm card-enter" style={{ animationDelay: '50ms' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Recebido
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400 tabular-nums">
                R$ {stats.totalRecebido.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.countPagas} pagas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm card-enter" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Atrasado
              </CardTitle>
              <DollarSign className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400 tabular-nums">
                R$ {stats.totalAtrasado.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.countAtrasadas} atrasadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="todas" className="text-white">Todas</SelectItem>
              <SelectItem value="pendente" className="text-white">Pendentes</SelectItem>
              <SelectItem value="paga" className="text-white">Pagas</SelectItem>
              <SelectItem value="atrasada" className="text-white">Atrasadas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={pagadorFilter} onValueChange={setPagadorFilter}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Filtrar por pagador" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="todos" className="text-white">Todos</SelectItem>
              {pagadores.map((pagador) => (
                <SelectItem
                  key={pagador.id_pagador}
                  value={pagador.id_pagador.toString()}
                  className="text-white"
                >
                  {pagador.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {filteredMensalidades.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-16 w-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || statusFilter !== "todas" || pagadorFilter !== "todos"
                  ? "Nenhuma mensalidade encontrada"
                  : "Nenhuma mensalidade cadastrada"}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm || statusFilter !== "todas" || pagadorFilter !== "todos"
                  ? "Tente ajustar os filtros"
                  : "Comece adicionando sua primeira mensalidade"}
              </p>
              {!searchTerm && statusFilter === "todas" && pagadorFilter === "todos" && (
                <Button
                  onClick={handleAddMensalidade}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Mensalidade
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pagination.paginatedItems.map((mensalidade, index) => (
                <Card
                  key={mensalidade.id_mensalidade}
                  className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-orange-500/50 transition-all card-enter"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">
                          {mensalidade.nome_mensalidade || mensalidade.descricao || "Mensalidade"}
                        </CardTitle>
                        {getStatusBadge(mensalidade.status)}
                      </div>
                      <div className="flex gap-2">
                        {mensalidade.status !== "paga" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarcarPaga(mensalidade)}
                            className="text-slate-400 hover:text-emerald-400"
                            title="Marcar como paga"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditMensalidade(mensalidade)}
                          className="text-slate-400 hover:text-orange-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(mensalidade)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Valor:</span>
                      <span className="text-white font-semibold text-lg tabular-nums">
                        R$ {parseFloat(mensalidade.valor).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{getPagadorNome(mensalidade.id_pagador)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Vence em: {new Date(mensalidade.data_vencimento).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginação */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={filteredMensalidades.length}
              canGoNext={pagination.canGoNext}
              canGoPrev={pagination.canGoPrev}
              onNext={pagination.goToNextPage}
              onPrev={pagination.goToPrevPage}
              itemLabel="mensalidades"
            />
          </>
        )}
      </div>

      {/* FAB */}
      <Button
        onClick={handleAddMensalidade}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-transform hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Modals */}
      <MensalidadeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mensalidade={editingMensalidade}
        onSave={handleSaveMensalidade}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Tem certeza que deseja remover esta mensalidade?
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
