import { useState, useEffect } from "react";
import { mensalidadeService } from "../services/mensalidade.service";
import { pagadorService } from "../services/pagador.service";
import { authService } from "../services/auth.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dashboard.ui/dialog";
import { Button } from "./dashboard.ui/button";
import { Input } from "./dashboard.ui/input";
import { Label } from "./dashboard.ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./dashboard.ui/select";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

export default function MensalidadeModal({ open, onOpenChange, mensalidade, onSave }) {
  const [loading, setLoading] = useState(false);
  const [pagadores, setPagadores] = useState([]);
  const [showPagadorForm, setShowPagadorForm] = useState(false);
  const [formData, setFormData] = useState({
    id_pagador: "",
    nome_mensalidade: "",
    valor: "",
    data_vencimento: "",
    status: "pendente",
  });
  const [novoPagadorData, setNovoPagadorData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
  });

  const estabelecimento = authService.getEstabelecimento();

  useEffect(() => {
    if (open) {
      carregarPagadores();
    }
  }, [open]);

  useEffect(() => {
    if (mensalidade) {
      setFormData({
        id_pagador: mensalidade.id_pagador?.toString() || "",
        nome_mensalidade: mensalidade.nome_mensalidade || mensalidade.descricao || "",
        valor: mensalidade.valor?.toString() || "",
        data_vencimento: mensalidade.data_vencimento?.split('T')[0] || "",
        status: mensalidade.status || "pendente",
      });
      setShowPagadorForm(false);
    } else {
      setFormData({
        id_pagador: "",
        nome_mensalidade: "",
        valor: "",
        data_vencimento: "",
        status: "pendente",
      });
      setNovoPagadorData({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
      });
    }
  }, [mensalidade, open]);

  const carregarPagadores = async () => {
    try {
      const data = await pagadorService.listar();
      const pagadoresDoEstabelecimento = data.filter(
        (p) => p.id_estabelecimento === estabelecimento?.id_estabelecimento
      );
      setPagadores(pagadoresDoEstabelecimento);
      
      if (pagadoresDoEstabelecimento.length === 0 && !mensalidade) {
        setShowPagadorForm(true);
      }
    } catch (err) {
      console.error("Erro ao carregar pagadores:", err);
      toast.error("Erro ao carregar pagadores");
    }
  };

  const handleCriarPagador = async () => {
    if (!novoPagadorData.nome.trim()) {
      toast.error("Nome do pagador é obrigatório");
      return;
    }

    if (!novoPagadorData.telefone.trim()) {
      toast.error("Telefone do pagador é obrigatório");
      return;
    }

    try {
      setLoading(true);

      const pagadorCriado = await pagadorService.criar({
        ...novoPagadorData,
        id_estabelecimento: estabelecimento?.id_estabelecimento,
        data_cadastro: new Date(),
      });

      toast.success("Pagador cadastrado com sucesso!");
      
      const data = await pagadorService.listar();
      const pagadoresDoEstabelecimento = data.filter(
        (p) => p.id_estabelecimento === estabelecimento?.id_estabelecimento
      );
      setPagadores(pagadoresDoEstabelecimento);
      
      setFormData({ ...formData, id_pagador: pagadorCriado.id_pagador.toString() });
      setShowPagadorForm(false);
      setNovoPagadorData({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
      });
    } catch (err) {
      console.error("Erro ao criar pagador:", err);
      toast.error(err.response?.data?.message || "Erro ao cadastrar pagador");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_pagador) {
      toast.error("Selecione um pagador");
      return;
    }

    if (!formData.nome_mensalidade.trim()) {
      toast.error("Nome da mensalidade é obrigatório");
      return;
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      toast.error("Valor inválido");
      return;
    }

    if (!formData.data_vencimento) {
      toast.error("Data de vencimento é obrigatória");
      return;
    }

    try {
      setLoading(true);

      const dados = {
        id_estabelecimento: estabelecimento?.id_estabelecimento,
        id_pagador: parseInt(formData.id_pagador),
        nome_mensalidade: formData.nome_mensalidade,
        descricao: formData.nome_mensalidade,
        valor: parseFloat(formData.valor),
        data_vencimento: formData.data_vencimento,
        status: formData.status,
      };

      if (mensalidade) {
        await mensalidadeService.atualizar(mensalidade.id_mensalidade, dados);
        toast.success("Mensalidade atualizada com sucesso!");
      } else {
        await mensalidadeService.criar(dados);
        toast.success("Mensalidade criada com sucesso!");
      }

      onSave();
      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao salvar mensalidade:", err);
      toast.error(err.response?.data?.message || "Erro ao salvar mensalidade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mensalidade ? "Editar Mensalidade" : "Nova Mensalidade"}
          </DialogTitle>
        </DialogHeader>

        {showPagadorForm || (pagadores.length === 0 && !mensalidade) ? (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-4">
              <p className="text-amber-400 text-sm">
                Você precisa cadastrar um pagador primeiro
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Cadastrar Novo Pagador
              </h3>

              <div>
                <Label htmlFor="nome_pagador" className="text-white">
                  Nome *
                </Label>
                <Input
                  id="nome_pagador"
                  type="text"
                  placeholder="Nome completo"
                  value={novoPagadorData.nome}
                  onChange={(e) =>
                    setNovoPagadorData({ ...novoPagadorData, nome: e.target.value })
                  }
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cpf_pagador" className="text-white">
                  CPF
                </Label>
                <Input
                  id="cpf_pagador"
                  type="text"
                  placeholder="000.000.000-00"
                  value={novoPagadorData.cpf}
                  onChange={(e) =>
                    setNovoPagadorData({ ...novoPagadorData, cpf: e.target.value })
                  }
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="telefone_pagador" className="text-white">
                  Telefone *
                </Label>
                <Input
                  id="telefone_pagador"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={novoPagadorData.telefone}
                  onChange={(e) =>
                    setNovoPagadorData({ ...novoPagadorData, telefone: e.target.value })
                  }
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email_pagador" className="text-white">
                  Email
                </Label>
                <Input
                  id="email_pagador"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={novoPagadorData.email}
                  onChange={(e) =>
                    setNovoPagadorData({ ...novoPagadorData, email: e.target.value })
                  }
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={loading}
                />
              </div>

              <Button
                type="button"
                onClick={handleCriarPagador}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar e Continuar"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="id_pagador" className="text-white">
                  Pagador *
                </Label>
                {!mensalidade && !showPagadorForm && (
                  <button
                    type="button"
                    onClick={() => setShowPagadorForm(true)}
                    className="text-orange-400 text-sm hover:text-orange-300"
                  >
                    + Cadastrar novo
                  </button>
                )}
              </div>

              {showPagadorForm && !mensalidade ? (
                <div className="space-y-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium text-sm">Novo Pagador</h4>
                    <button
                      type="button"
                      onClick={() => setShowPagadorForm(false)}
                      className="text-slate-400 text-sm hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>

                  <Input
                    type="text"
                    placeholder="Nome *"
                    value={novoPagadorData.nome}
                    onChange={(e) =>
                      setNovoPagadorData({ ...novoPagadorData, nome: e.target.value })
                    }
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />

                  <Input
                    type="text"
                    placeholder="CPF"
                    value={novoPagadorData.cpf}
                    onChange={(e) =>
                      setNovoPagadorData({ ...novoPagadorData, cpf: e.target.value })
                    }
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />

                  <Input
                    type="tel"
                    placeholder="Telefone *"
                    value={novoPagadorData.telefone}
                    onChange={(e) =>
                      setNovoPagadorData({ ...novoPagadorData, telefone: e.target.value })
                    }
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />

                  <Input
                    type="email"
                    placeholder="Email"
                    value={novoPagadorData.email}
                    onChange={(e) =>
                      setNovoPagadorData({ ...novoPagadorData, email: e.target.value })
                    }
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />

                  <Button
                    type="button"
                    onClick={handleCriarPagador}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={loading}
                    size="sm"
                  >
                    {loading ? "Cadastrando..." : "Cadastrar Pagador"}
                  </Button>
                </div>
              ) : (
                <Select
                  value={formData.id_pagador}
                  onValueChange={(value) => setFormData({ ...formData, id_pagador: value })}
                  disabled={loading || !!mensalidade}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione um pagador" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
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
              )}
            </div>

            <div>
              <Label htmlFor="nome_mensalidade" className="text-white">
                Nome da Mensalidade *
              </Label>
              <Input
                id="nome_mensalidade"
                type="text"
                placeholder="Ex: Mensalidade Escolar - Janeiro/2025"
                value={formData.nome_mensalidade}
                onChange={(e) =>
                  setFormData({ ...formData, nome_mensalidade: e.target.value })
                }
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label htmlFor="valor" className="text-white">
                Valor *
              </Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label htmlFor="data_vencimento" className="text-white">
                Data de Vencimento *
              </Label>
              <Input
                id="data_vencimento"
                type="date"
                value={formData.data_vencimento}
                onChange={(e) =>
                  setFormData({ ...formData, data_vencimento: e.target.value })
                }
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-white">
                Status *
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={loading}
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="pendente" className="text-white">
                    Pendente
                  </SelectItem>
                  <SelectItem value="paga" className="text-white">
                    Paga
                  </SelectItem>
                  <SelectItem value="atrasada" className="text-white">
                    Atrasada
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                disabled={loading}
              >
                {loading ? "Salvando..." : mensalidade ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
