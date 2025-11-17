import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./dashboard.ui/card";
import { Button } from "./dashboard.ui/button";
import { Users, AlertCircle, DollarSign, ShoppingCart, TrendingDown, Building, Plus, ArrowRight } from "lucide-react";
import { mensalidadeService } from "../services/mensalidade.service";
import { compraService } from "../services/compra.service";
import { pagadorService } from "../services/pagador.service";
import { authService } from "../services/auth.service";

export function DashboardView({ selectedDate }: { selectedDate: Date }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPagadores: 0,
    mensalidadesPendentesMes: 0,
    totalReceberMes: 0,
    comprasMes: 0,
    gastoTotalMes: 0,
    estabelecimentoNome: "",
  });

  const estabelecimento = authService.getEstabelecimento();
  const usuario = authService.getUsuarioLogado();

  useEffect(() => {
    carregarDados();
  }, [selectedDate]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      let dateSelected = new Date();
      if (selectedDate) {
        dateSelected = selectedDate
      }
      const currentMonth = dateSelected.getMonth();
      const currentYear = dateSelected.getFullYear();

      const [mensalidadesData, comprasData, pagadoresData] = await Promise.all([
        mensalidadeService.listar(),
        compraService.listar(),
        pagadorService.listar(),
      ]);

      const mensalidadesDoMes = mensalidadesData.filter((m: any) => {
        const date = new Date(m.data_vencimento);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const comprasDoMes = comprasData.filter((c: any) => {
        const date = new Date(c.data_compra);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const pagadoresDoEstabelecimento = pagadoresData.filter(
        (p: any) => p.id_estabelecimento === estabelecimento?.id_estabelecimento
      );

      const mensalidadesPendentes = mensalidadesDoMes.filter(
        (m: any) => m.status === "pendente" || m.status === "atrasada"
      );

      const totalReceber = mensalidadesPendentes.reduce(
        (sum: number, m: any) => sum + parseFloat(m.valor || 0),
        0
      );

      const gastoTotal = comprasDoMes.reduce(
        (sum: number, c: any) => sum + parseFloat(c.valor_total || 0),
        0
      );

      setStats({
        totalPagadores: pagadoresDoEstabelecimento.length,
        mensalidadesPendentesMes: mensalidadesPendentes.length,
        totalReceberMes: totalReceber,
        comprasMes: comprasDoMes.length,
        gastoTotalMes: gastoTotal,
        estabelecimentoNome: estabelecimento?.nome || "Meu Estabelecimento",
      });
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const currentDate = new Date();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-2xl font-semibold">Visão Geral</h2>
        <p className="text-slate-400 mt-1">
          Resumo financeiro de {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total de Pagadores
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalPagadores}</div>
            <p className="text-xs text-slate-500 mt-1">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Mensalidades Pendentes
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{stats.mensalidadesPendentesMes}</div>
            <p className="text-xs text-slate-500 mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total a Receber
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              R$ {stats.totalReceberMes.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Compras Realizadas
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.comprasMes}</div>
            <p className="text-xs text-slate-500 mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Gasto Total
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              R$ {stats.gastoTotalMes.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Estabelecimento
            </CardTitle>
            <Building className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white truncate">
              {stats.estabelecimentoNome}
            </div>
            <p className="text-xs text-orange-100 mt-1">{usuario?.nome}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-white text-lg font-semibold mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-orange-500/50 transition-all cursor-pointer group"
            onClick={() => navigate("/dashboard/mensalidades")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-all">
                  <DollarSign className="h-6 w-6 text-orange-400" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-orange-400 transition-all" />
              </div>
              <h4 className="text-white font-semibold mb-1">Nova Mensalidade</h4>
              <p className="text-slate-400 text-sm">Cadastrar pagamento recorrente</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-orange-500/50 transition-all cursor-pointer group"
            onClick={() => navigate("/dashboard/pagadores")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-all">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-orange-400 transition-all" />
              </div>
              <h4 className="text-white font-semibold mb-1">Novo Pagador</h4>
              <p className="text-slate-400 text-sm">Cadastrar pessoa responsável</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-orange-500/50 transition-all cursor-pointer group"
            onClick={() => navigate("/dashboard/compras")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-all">
                  <ShoppingCart className="h-6 w-6 text-orange-400" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-orange-400 transition-all" />
              </div>
              <h4 className="text-white font-semibold mb-1">Registrar Compra</h4>
              <p className="text-slate-400 text-sm">Adicionar nova despesa</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {stats.mensalidadesPendentesMes > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-2">Atenção Necessária</h3>
                <p className="text-amber-300">
                  Você tem {stats.mensalidadesPendentesMes} mensalidade(s) pendente(s) este mês.
                  Total a receber: <strong>R$ {stats.totalReceberMes.toFixed(2)}</strong>
                </p>
                <Button
                  onClick={() => navigate("/dashboard/mensalidades")}
                  className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
                  size="sm"
                >
                  Ver Mensalidades
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}