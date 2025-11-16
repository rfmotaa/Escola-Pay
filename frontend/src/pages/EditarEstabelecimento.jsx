import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/dashboard.ui/card";
import { Button } from "../components/dashboard.ui/button";
import { Input } from "../components/dashboard.ui/input";
import { Label } from "../components/dashboard.ui/label";
import { Building, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { estabelecimentoService } from "../services/estabelecimento.service";
import { authService } from "../services/auth.service";

export default function EditarEstabelecimento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [formData, setFormData] = useState({
    nome_estabelecimento: "",
    cnpj: "",
  });

  const estabelecimento = authService.getEstabelecimento();
  const usuario = authService.getUsuarioLogado();

  useEffect(() => {
    carregarEstabelecimento();
  }, []);

  const carregarEstabelecimento = async () => {
    try {
      setLoading(true);
      setErro("");

      if (!estabelecimento) {
        setErro("Nenhum estabelecimento encontrado");
        setLoading(false);
        return;
      }

      // Buscar dados atualizados do estabelecimento
      const estabelecimentos = await estabelecimentoService.listarDoUsuario(usuario?.id_usuario);
      const estabelecimentoAtual = estabelecimentos.find(
        (e) => e.id_estabelecimento === estabelecimento.id_estabelecimento
      );

      if (estabelecimentoAtual) {
        setFormData({
          nome_estabelecimento: estabelecimentoAtual.nome_estabelecimento || "",
          cnpj: estabelecimentoAtual.cnpj || "",
        });
      }
    } catch (err) {
      console.error("Erro ao carregar estabelecimento:", err);
      setErro(err.response?.data?.message || "Erro ao carregar dados do estabelecimento");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErro("");
    setSucesso(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome_estabelecimento.trim()) {
      setErro("O nome do estabelecimento é obrigatório");
      return;
    }

    try {
      setSaving(true);
      setErro("");
      setSucesso(false);

      await estabelecimentoService.atualizar(estabelecimento.id_estabelecimento, {
        nome_estabelecimento: formData.nome_estabelecimento,
      });

      // Atualizar localStorage
      const estabelecimentoAtualizado = {
        ...estabelecimento,
        nome_estabelecimento: formData.nome_estabelecimento,
      };
      localStorage.setItem("estabelecimento", JSON.stringify(estabelecimentoAtualizado));

      setSucesso(true);
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Erro ao atualizar estabelecimento:", err);
      setErro(err.response?.data?.message || "Erro ao salvar alterações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />
      
      <Sidebar />
      
      <div className="flex-1 p-8 relative">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Meu Estabelecimento</h1>
            <p className="text-slate-400">Gerencie as informações do seu estabelecimento</p>
          </div>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">Dados do Estabelecimento</CardTitle>
                <CardDescription className="text-slate-400">
                  Atualize as informações do seu estabelecimento
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome_estabelecimento" className="text-slate-300">
                  Nome do Estabelecimento *
                </Label>
                <Input
                  id="nome_estabelecimento"
                  name="nome_estabelecimento"
                  type="text"
                  value={formData.nome_estabelecimento}
                  onChange={handleChange}
                  placeholder="Ex: Escola ABC"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-slate-300">
                  CNPJ
                </Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  type="text"
                  value={formData.cnpj}
                  disabled
                  className="bg-slate-700/30 border-slate-600 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500">
                  O CNPJ não pode ser alterado após o cadastro
                </p>
              </div>

              {erro && (
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{erro}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {sucesso && (
                <Card className="bg-emerald-500/10 border-emerald-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-emerald-300 text-sm font-medium">
                          Alterações salvas com sucesso!
                        </p>
                        <p className="text-emerald-400 text-xs mt-1">
                          Redirecionando para o dashboard...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={saving}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-slate-800/30 border-slate-700/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-400">
                <p className="font-medium mb-1">Informações importantes:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>O nome do estabelecimento será exibido em relatórios e documentos</li>
                  <li>O CNPJ é definido no cadastro inicial e não pode ser modificado</li>
                  <li>Alterações serão aplicadas imediatamente em todo o sistema</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
