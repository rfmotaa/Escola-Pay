import '../styles/Dashboard.css';

import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { DashboardView } from "../components/DashboardView";
import { Card } from "../components/dashboard.ui/card";
import { Button } from "../components/dashboard.ui/button";
import { LayoutDashboard, ChevronLeft, ChevronRight, LogOut, Loader2, Users, DollarSign, ShoppingCart, Building } from "lucide-react";
import { authService } from "../services/auth.service";
import { estabelecimentoService } from "../services/estabelecimento.service";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [estabelecimento, setEstabelecimento] = useState<any>(null);

  const usuario = authService.getUsuarioLogado();

  useEffect(() => {
    // Verificar se tem estabelecimento no localStorage antes de carregar dados
    const estabelecimentoLS = authService.getEstabelecimento();
    if (!estabelecimentoLS) {
      navigate("/onboarding", { replace: true });
      return;
    }
    carregarDados();
  }, [navigate]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro("");

      // Buscar estabelecimento do usuário
      const estabelecimentosData = await estabelecimentoService.listarDoUsuario(usuario?.id_usuario || 1);
      
      if (!estabelecimentosData || estabelecimentosData.length === 0) {
        // Usar estabelecimento do localStorage se não encontrar no backend
        const estabelecimentoLS = authService.getEstabelecimento();
        if (estabelecimentoLS) {
          setEstabelecimento(estabelecimentoLS);
        } else {
          setEstabelecimento(null);
          setCarregando(false);
          return;
        }
      } else {
        const estabelecimentoAtual = estabelecimentosData[0];
        setEstabelecimento(estabelecimentoAtual);

        // Atualizar localStorage com o estabelecimento
        localStorage.setItem("estabelecimento", JSON.stringify(estabelecimentoAtual));
        localStorage.setItem("temEstabelecimento", "true");
      }

      setCarregando(false);
    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao carregar dados");
      setCarregando(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setSelectedDate(new Date());
  };

  const isCurrentMonth = 
    selectedDate.getMonth() === new Date().getMonth() &&
    selectedDate.getFullYear() === new Date().getFullYear();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Pagadores", icon: Users, path: "/dashboard/pagadores" },
    { label: "Mensalidades", icon: DollarSign, path: "/dashboard/mensalidades" },
    { label: "Compras", icon: ShoppingCart, path: "/dashboard/compras" },
    { label: "Estabelecimento", icon: Building, path: "/dashboard/estabelecimento" },
  ];

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Se não tiver estabelecimento, não renderizar nada (o useEffect vai redirecionar)
  const estabelecimentoLS = authService.getEstabelecimento();
  if (!estabelecimentoLS && !carregando) {
    return null;
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Erro ao carregar</h2>
          <p className="text-slate-400 mb-4">{erro}</p>
          <Button 
            onClick={carregarDados}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
          >
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />
      
      <div className="relative flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-slate-900/60 backdrop-blur-sm border-r border-slate-700/50 p-6">
          <div className="mb-8">
            <h1 className="mb-1 text-white font-semibold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Finance Manager
            </h1>
            <p className="text-slate-400 text-sm">Gestão Financeira</p>
          </div>

          <nav className="space-y-2 mb-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Card className="p-4 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <p className="text-slate-400 text-sm mb-2">Período</p>
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousMonth}
                className="h-8 w-8 text-slate-400 hover:text-orange-500 hover:bg-slate-700/50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <p className="text-white font-medium">
                  {monthNames[selectedDate.getMonth()].substring(0, 3)}
                </p>
                <p className="text-slate-400 text-sm">
                  {selectedDate.getFullYear()}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextMonth}
                className="h-8 w-8 text-slate-400 hover:text-orange-500 hover:bg-slate-700/50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {!isCurrentMonth && (
              <Button 
                onClick={goToCurrentMonth} 
                variant="outline" 
                size="sm" 
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:text-white"
              >
                Mês Atual
              </Button>
            )}
          </Card>

          <div className="mt-auto pt-6 space-y-4">
            <Card className="p-4 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
                  {usuario?.nome?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{usuario?.nome || "Usuário"}</p>
                  <p className="text-xs text-slate-400 truncate">{usuario?.email || "email@exemplo.com"}</p>
                </div>
              </div>
            </Card>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <DashboardView />
        </div>
      </div>
    </div>
  );
}