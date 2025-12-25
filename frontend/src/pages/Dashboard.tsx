/**
 * @fileoverview Página principal do Dashboard refatorada
 * 
 * Melhorias:
 * - Usa layout compartilhado (sidebar gerenciada pelo DashboardLayout)
 * - Recebe data do contexto compartilhado
 * - Loading state com skeleton
 */

import '../styles/Dashboard.css';

import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { DashboardView } from "../components/DashboardView";
import { Card } from "../components/dashboard.ui/card";
import { Button } from "../components/dashboard.ui/button";
import { Loader2 } from "lucide-react";
import { authService } from "../services/auth.service";
import { estabelecimentoService } from "../services/estabelecimento.service";

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedDate } = useOutletContext<{ selectedDate: Date }>();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [estabelecimento, setEstabelecimento] = useState<any>(null);

  const usuario = authService.getUsuarioLogado();

  useEffect(() => {
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

      const estabelecimentosData = await estabelecimentoService.listarDoUsuario(usuario?.id_usuario || 1);
      
      if (!estabelecimentosData || estabelecimentosData.length === 0) {
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
        localStorage.setItem("estabelecimento", JSON.stringify(estabelecimentoAtual));
        localStorage.setItem("temEstabelecimento", "true");
      }

      setCarregando(false);
    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao carregar dados");
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const estabelecimentoLS = authService.getEstabelecimento();
  if (!estabelecimentoLS && !carregando) {
    return null;
  }

  if (erro) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
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
    <div className="flex-1 p-8">
      <DashboardView selectedDate={selectedDate} />
    </div>
  );
}
