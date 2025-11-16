import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { estabelecimentoService } from "../services/estabelecimento.service";
import { authService } from "../services/auth.service";
import { Button } from "../components/dashboard.ui/button";
import { Input } from "../components/dashboard.ui/input";
import { Label } from "../components/dashboard.ui/label";
import { toast } from "sonner";
import { Building2, ArrowRight } from "lucide-react";

export default function OnboardingEstabelecimento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
  });

  const usuario = authService.getUsuarioLogado();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast.error("Nome do estabelecimento é obrigatório");
      return;
    }

    if (!formData.cnpj.trim()) {
      toast.error("CNPJ é obrigatório");
      return;
    }

    try {
      setLoading(true);

      const response = await estabelecimentoService.criar({
        id_criador: usuario?.id_usuario,
        nome: formData.nome,
        cnpj: formData.cnpj,
        ativo: true,
      });

      const estabelecimento = response.estabelecimento || response;

      localStorage.setItem("temEstabelecimento", "true");
      localStorage.setItem("estabelecimento", JSON.stringify(estabelecimento));

      toast.success("Estabelecimento criado com sucesso!");
      
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);
    } catch (err) {
      console.error("Erro ao criar estabelecimento:", err);
      toast.error(err.response?.data?.message || "Erro ao criar estabelecimento");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Configure seu Estabelecimento
          </h1>
          <p className="text-slate-400">
            Primeiro, vamos criar seu estabelecimento para começar a usar o sistema
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome" className="text-white">
                Nome do Estabelecimento
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Ex: Escola ABC"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label htmlFor="cnpj" className="text-white">
                CNPJ
              </Label>
              <Input
                id="cnpj"
                type="text"
                placeholder="00.000.000/0001-00"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              disabled={loading}
            >
              {loading ? (
                "Criando..."
              ) : (
                <>
                  Criar Estabelecimento
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Você poderá editar essas informações depois nas configurações
        </p>
      </div>
    </div>
  );
}
