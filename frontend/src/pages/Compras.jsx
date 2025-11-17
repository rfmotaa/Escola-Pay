import { useState, useEffect, useCallback } from "react";
import DashboardSideBar from "../components/DashboardSidebar";
import { compraService } from "../services/compra.service";
import { authService } from "../services/auth.service";
import { Button } from "../components/dashboard.ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/dashboard.ui/card";
import { Input } from "../components/dashboard.ui/input";
import { Badge } from "../components/dashboard.ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/dashboard.ui/select";
import { toast } from "sonner";
import { ShoppingCart, Plus, Edit, Trash2, Eye, Search, Calendar, Tag } from "lucide-react";
import CompraModal from "../components/CompraModal";
import ItensCompraModal from "../components/ItensCompraModal";
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

export default function Compras() {
  const [compras, setCompras] = useState([]);
  const [filteredCompras, setFilteredCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [itensModalOpen, setItensModalOpen] = useState(false);
  const [editingCompra, setEditingCompra] = useState(null);
  const [viewingCompra, setViewingCompra] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compraToDelete, setCompraToDelete] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [totalMes, setTotalMes] = useState(0);
  const [numComprasMes, setNumComprasMes] = useState(0);
  const [compraMaisCara, setCompraMaisCara] = useState(null);

  const estabelecimento = authService.getEstabelecimento();

  const handleDateChange = useCallback((date) => {
    setDataSelecionada(date);
  }, []);

  useEffect(() => {
    carregarCompras();
  }, []);

  
  useEffect(() => {
    aplicarFiltros();
  }, [searchTerm, categoriaFilter, compras]);
  
  const loadComprasUsingDate = () => {
    const currentMonth = dataSelecionada.getMonth();
    const currentYear = dataSelecionada.getFullYear();
    
    const comprasDoMes = compras.filter((c) => {
      const date = new Date(c.data_compra);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    setTotalMes(comprasDoMes.reduce((sum, c) => sum + parseFloat(c.valor_total || 0), 0));
    setNumComprasMes(comprasDoMes.length);
    setCompraMaisCara(compras.length > 0
      ? Math.max(...compras.map((c) => parseFloat(c.valor_total || 0)))
      : 0);
    }
    
  useEffect(loadComprasUsingDate, [dataSelecionada, compras]);
  const carregarCompras = async () => {
    try {
      setLoading(true);
      const data = await compraService.listar();
      const comprasDoEstabelecimento = data.filter(
        (c) => c.id_estabelecimento === estabelecimento?.id_estabelecimento
      );
      setCompras(comprasDoEstabelecimento);
      setFilteredCompras(comprasDoEstabelecimento);
      
    } catch (err) {
      console.error("Erro ao carregar compras:", err);
      toast.error("Erro ao carregar compras");
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...compras];

    if (categoriaFilter !== "todas") {
      filtered = filtered.filter((c) => c.categoria === categoriaFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.nome_compra?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCompras(filtered);
  };

  const handleAddCompra = () => {
    setEditingCompra(null);
    setModalOpen(true);
  };

  const handleEditCompra = (compra) => {
    setEditingCompra(compra);
    setModalOpen(true);
  };

  const handleViewItens = (compra) => {
    setViewingCompra(compra);
    setItensModalOpen(true);
  };

  const handleDeleteClick = (compra) => {
    setCompraToDelete(compra);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await compraService.deletar(compraToDelete.id_compra);
      toast.success("Compra removida com sucesso!");
      setDeleteDialogOpen(false);
      setCompraToDelete(null);
      carregarCompras();
    } catch (err) {
      console.error("Erro ao deletar compra:", err);
      toast.error("Erro ao remover compra");
    }
  };

  const handleSaveCompra = async () => {
    setModalOpen(false);
    await carregarCompras();
  };

  const getCategoriaConfig = (categoria) => {
    const configs = {
      supermercado: { label: "Supermercado", className: "bg-green-500/20 text-green-400 border-green-500/50" },
      utilidades: { label: "Utilidades", className: "bg-blue-500/20 text-blue-400 border-blue-500/50" },
      entretenimento: { label: "Entretenimento", className: "bg-purple-500/20 text-purple-400 border-purple-500/50" },
      transporte: { label: "Transporte", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" },
      outros: { label: "Outros", className: "bg-slate-500/20 text-slate-400 border-slate-500/50" },
    };
    return configs[categoria] || configs.outros;
  };

  const getCategoriaElement = (categoria) => {
    const config = getCategoriaConfig(categoria);
    return <Badge className={config.className}>{config.label}</Badge>;
  };

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
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Compras</h1>
              <p className="text-slate-400">Controle de compras e despesas do estabelecimento</p>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Gasto este Mês
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ {totalMes.toFixed(2)}
              </div>
              <p className="text-xs text-orange-100 mt-1">
                {numComprasMes} compras realizadas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Compras Realizadas
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{compras.length}</div>
              <p className="text-xs text-slate-500 mt-1">Total de registros</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Compra Mais Cara
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                R$ {compraMaisCara.toFixed(2)}
              </div>
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

          <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="todas" className="text-white">Todas</SelectItem>
              <SelectItem value="supermercado" className="text-white">Supermercado</SelectItem>
              <SelectItem value="utilidades" className="text-white">Utilidades</SelectItem>
              <SelectItem value="entretenimento" className="text-white">Entretenimento</SelectItem>
              <SelectItem value="transporte" className="text-white">Transporte</SelectItem>
              <SelectItem value="outros" className="text-white">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredCompras.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-16 w-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || categoriaFilter !== "todas"
                  ? "Nenhuma compra encontrada"
                  : "Nenhuma compra cadastrada"}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm || categoriaFilter !== "todas"
                  ? "Tente ajustar os filtros"
                  : "Comece registrando sua primeira compra"}
              </p>
              {!searchTerm && categoriaFilter === "todas" && (
                <Button
                  onClick={handleAddCompra}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Compra
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompras.map((compra) => (
              <Card
                key={compra.id_compra}
                className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-orange-500/50 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">
                        {compra.nome_compra || compra.descricao || "Compra"}
                      </CardTitle>
                      {getCategoriaElement(compra.categoria)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewItens(compra)}
                        className="text-slate-400 hover:text-blue-400"
                        title="Ver itens"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCompra(compra)}
                        className="text-slate-400 hover:text-orange-400"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(compra)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Valor Total:</span>
                    <span className="text-white font-semibold text-lg">
                      R$ {parseFloat(compra.valor_total || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(compra.data_compra).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {compra.descricao && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Tag className="h-4 w-4" />
                      <span className="text-sm truncate">{compra.descricao}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={handleAddCompra}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
      >
        <Plus className="h-6 w-6" />
      </Button>

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
    </div>
  );
}
