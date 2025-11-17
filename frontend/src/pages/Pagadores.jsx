import { useState, useEffect } from "react";
import DashboardSideBar from "../components/DashboardSidebar";
import { pagadorService } from "../services/pagador.service";
import { authService } from "../services/auth.service";
import { Button } from "../components/dashboard.ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/dashboard.ui/card";
import { Input } from "../components/dashboard.ui/input";
import { toast } from "sonner";
import { Users, Plus, Edit, Trash2, Mail, Phone, CreditCard, Search } from "lucide-react";
import PagadorModal from "../components/PagadorModal";
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

export default function Pagadores() {
  const [pagadores, setPagadores] = useState([]);
  const [filteredPagadores, setFilteredPagadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPagador, setEditingPagador] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pagadorToDelete, setPagadorToDelete] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const estabelecimento = authService.getEstabelecimento();

  useEffect(() => {
    carregarPagadores();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = pagadores.filter((p) =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf?.includes(searchTerm) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPagadores(filtered);
    } else {
      setFilteredPagadores(pagadores);
    }
  }, [searchTerm, pagadores]);

  const carregarPagadores = async () => {
    try {
      setLoading(true);
      const data = await pagadorService.listar();
      const pagadoresDoEstabelecimento = data.filter(
        (p) => p.id_estabelecimento === estabelecimento?.id_estabelecimento
      );
      setPagadores(pagadoresDoEstabelecimento);
      setFilteredPagadores(pagadoresDoEstabelecimento);
    } catch (err) {
      console.error("Erro ao carregar pagadores:", err);
      toast.error("Erro ao carregar pagadores");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPagador = () => {
    setEditingPagador(null);
    setModalOpen(true);
  };

  const handleEditPagador = (pagador) => {
    setEditingPagador(pagador);
    setModalOpen(true);
  };

  const handleDeleteClick = (pagador) => {
    setPagadorToDelete(pagador);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await pagadorService.deletar(pagadorToDelete.id_pagador);
      toast.success("Pagador removido com sucesso!");
      setDeleteDialogOpen(false);
      setPagadorToDelete(null);
      carregarPagadores();
    } catch (err) {
      console.error("Erro ao deletar pagador:", err);
      toast.error("Erro ao remover pagador");
    }
  };

  const handleSavePagador = async () => {
    setModalOpen(false);
    await carregarPagadores();
  };

  const totalPagadores = pagadores.length;
  const pagadoresAtivos = pagadores.filter((p) => {
    const usedDate = selectedDate || new Date()

    usedDate.setMonth(usedDate.getMonth() - 1);
    return new Date(p.createdAt) > usedDate;
  }).length;

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
      
      <DashboardSideBar onDateChange={(date) => setSelectedDate(date)} />

      <div className="flex-1 p-6 relative">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Pagadores</h1>
              <p className="text-slate-400">Cadastre e gerencie as pessoas que pagam mensalidades</p>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total de Pagadores
              </CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalPagadores}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Cadastrados este Mês
              </CardTitle>
              <Users className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{pagadoresAtivos}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Inativos
              </CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-500">
                {totalPagadores - pagadoresAtivos}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CPF ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {filteredPagadores.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? "Nenhum pagador encontrado" : "Nenhum pagador cadastrado"}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm
                  ? "Tente buscar com outros termos"
                  : "Comece adicionando seu primeiro pagador"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleAddPagador}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Pagador
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPagadores.map((pagador) => (
              <Card
                key={pagador.id_pagador}
                className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-orange-500/50 transition-all"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="truncate">{pagador.nome}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditPagador(pagador)}
                        className="text-slate-400 hover:text-orange-400"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(pagador)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pagador.cpf && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm">{pagador.cpf}</span>
                    </div>
                  )}
                  {pagador.telefone && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{pagador.telefone}</span>
                    </div>
                  )}
                  {pagador.email && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm truncate">{pagador.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={handleAddPagador}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <PagadorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        pagador={editingPagador}
        onSave={handleSavePagador}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Tem certeza que deseja remover <strong>{pagadorToDelete?.nome}</strong>?
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
