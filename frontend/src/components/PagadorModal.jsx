import { useState, useEffect } from "react";
import { pagadorService } from "../services/pagador.service";
import { authService } from "../services/auth.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dashboard.ui/dialog";
import { Button } from "./dashboard.ui/button";
import { Input } from "./dashboard.ui/input";
import { Label } from "./dashboard.ui/label";
import { toast } from "sonner";

export default function PagadorModal({ open, onOpenChange, pagador, onSave }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
  });

  const estabelecimento = authService.getEstabelecimento();

  useEffect(() => {
    if (pagador) {
      setFormData({
        nome: pagador.nome || "",
        cpf: pagador.cpf || "",
        telefone: pagador.telefone || "",
        email: pagador.email || "",
      });
    } else {
      setFormData({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
      });
    }
  }, [pagador, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!formData.telefone.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }

    try {
      setLoading(true);

      const dados = {
        ...formData,
        id_estabelecimento: estabelecimento?.id_estabelecimento,
        data_cadastro: new Date(),
      };

      if (pagador) {
        await pagadorService.atualizar(pagador.id_pagador, dados);
        toast.success("Pagador atualizado com sucesso!");
      } else {
        await pagadorService.criar(dados);
        toast.success("Pagador criado com sucesso!");
      }

      onSave();
      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao salvar pagador:", err);
      toast.error(err.response?.data?.message || "Erro ao salvar pagador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {pagador ? "Editar Pagador" : "Adicionar Pagador"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome" className="text-white">
              Nome *
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
              disabled={loading}
              required
            />
          </div>

          <div>
            <Label htmlFor="cpf" className="text-white">
              CPF
            </Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="telefone" className="text-white">
              Telefone *
            </Label>
            <Input
              id="telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
              disabled={loading}
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
              disabled={loading}
            />
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
              {loading ? "Salvando..." : pagador ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
