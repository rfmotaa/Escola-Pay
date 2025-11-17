import { useState, useEffect, useCallback } from "react";
import DashboardSideBar from "../components/DashboardSidebar";
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
import { data } from "react-router-dom";

export default function Mensalidades() {
  const [mensalidades, setMensalidades] = useState<any[]>([]);
  const [pagadores, setPagadores] = useState<any[]>([]);
  const [filteredMensalidades, setFilteredMensalidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [pagadorFilter, setPagadorFilter] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMensalidade, setEditingMensalidade] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mensalidadeToDelete, setMensalidadeToDelete] = useState<any>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());

  const estabelecimento = authService.getEstabelecimento();

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (dataSelecionada) {
      const selectedMonth = dataSelecionada.getMonth();
      const selectedYear = dataSelecionada.getFullYear();

      const mensalidadesFiltradas = mensalidades.filter((m: any) => {
        const created = new Date(m.data_vencimento);
        return created.getMonth() === selectedMonth && created.getFullYear() === selectedYear;
      });

      setFilteredMensalidades(mensalidadesFiltradas);
    }
  }, [dataSelecionada, mensalidades]);

  const handleDateChange = useCallback((date: any) => {
    setDataSelecionada(date);
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [searchTerm, statusFilter, pagadorFilter, mensalidades]);

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

  const aplicarFiltros = () => {
    let filtered: any[] = [...mensalidades];

    if (statusFilter !== "todas") {
      filtered = filtered.filter((m) => m.status === statusFilter);
    }

    if (pagadorFilter !== "todos") {
      filtered = filtered.filter((m) => m.id_pagador === parseInt(pagadorFilter));
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.nome_mensalidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMensalidades(filtered);
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

  const getStatusBadge = (status: keyof { pendente: any, paga: any, atrasada: any }) => {
    const configs = {
      pendente: { label: "Pendente", className: "bg-amber-500/20 text-amber-400 border-amber-500/50" },
      paga: { label: "Paga", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" },
      atrasada: { label: "Atrasada", className: "bg-red-500/20 text-red-400 border-red-500/50" },
    };
    const config = configs[status] || configs.pendente;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const totalReceber = filteredMensalidades
    .filter((m) => m.status === "pendente")
    .reduce((sum, m) => sum + parseFloat(m.valor), 0);

  const totalRecebido = filteredMensalidades
    .filter((m) => m.status === "paga")
    .reduce((sum, m) => sum + parseFloat(m.valor), 0);

  const totalAtrasado = filteredMensalidades
    .filter((m) => m.status === "atrasada")
    .reduce((sum, m) => sum + parseFloat(m.valor), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />

      <DashboardSideBar onDateChange={handleDateChange} />

      <div className="flex-1 p-6 relative">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Mensalidades</h1>
              <p className="text-slate-400">Controle de pagamentos e recebimentos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Total a Receber
                </CardTitle>
                <DollarSign className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-400">
                  R$ {totalReceber.toFixed(2)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {filteredMensalidades.filter((m) => m.status === "pendente").length} pendentes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Total Recebido
                </CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">
                  R$ {totalRecebido.toFixed(2)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {filteredMensalidades.filter((m) => m.status === "paga").length} pagas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Total Atrasado
                </CardTitle>
                <DollarSign className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">
                  R$ {totalAtrasado.toFixed(2)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {filteredMensalidades.filter((m) => m.status === "atrasada").length} atrasadas
                </p>
              </CardContent>
            </Card>
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMensalidades.map((mensalidade) => (
                <Card
                  key={mensalidade.id_mensalidade}
                  className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-orange-500/50 transition-all"
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
                      <span className="text-white font-semibold text-lg">
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
          )}
        </div>

        <Button
          onClick={handleAddMensalidade}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Plus className="h-6 w-6" />
        </Button>

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
    </div>
  );
}
