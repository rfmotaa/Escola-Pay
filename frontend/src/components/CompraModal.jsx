import { useState, useEffect } from "react";
import { compraService } from "../services/compra.service";
import { itemCompraService } from "../services/itemCompra.service";
import { authService } from "../services/auth.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dashboard.ui/dialog";
import { Button } from "./dashboard.ui/button";
import { Input } from "./dashboard.ui/input";
import { Label } from "./dashboard.ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./dashboard.ui/select";
import { Textarea } from "./dashboard.ui/textarea";
import { Card, CardContent } from "./dashboard.ui/card";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Plus, Trash2, ShoppingCart } from "lucide-react";

export default function CompraModal({ open, onOpenChange, compra, onSave }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome_compra: "",
    categoria: "outros",
    data_compra: new Date().toISOString().split('T')[0],
    descricao: "",
  });
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({
    nome_item: "",
    quantidade: "",
    preco_unitario: "",
  });

  const estabelecimento = authService.getEstabelecimento();

  useEffect(() => {
    if (open) {
      if (compra) {
        setFormData({
          nome_compra: compra.nome_compra || "",
          categoria: compra.categoria || "outros",
          data_compra: compra.data_compra?.split('T')[0] || new Date().toISOString().split('T')[0],
          descricao: compra.descricao || "",
        });
        carregarItens(compra.id_compra);
        setStep(2);
      } else {
        setFormData({
          nome_compra: "",
          categoria: "outros",
          data_compra: new Date().toISOString().split('T')[0],
          descricao: "",
        });
        setItens([]);
        setStep(1);
      }
      setNovoItem({
        nome_item: "",
        quantidade: "",
        preco_unitario: "",
      });
    }
  }, [open, compra]);

  const carregarItens = async (id_compra) => {
    try {
      const data = await itemCompraService.listar(id_compra);
      setItens(data || []);
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
      setItens([]);
    }
  };

  const handleNextStep = () => {
    if (!formData.nome_compra.trim()) {
      toast.error("Nome da compra é obrigatório");
      return;
    }
    setStep(2);
  };

  const handleAdicionarItem = () => {
    if (!novoItem.nome_item.trim()) {
      toast.error("Nome do item é obrigatório");
      return;
    }

    if (!novoItem.quantidade || parseFloat(novoItem.quantidade) <= 0) {
      toast.error("Quantidade inválida");
      return;
    }

    if (!novoItem.preco_unitario || parseFloat(novoItem.preco_unitario) <= 0) {
      toast.error("Preço unitário inválido");
      return;
    }

    const item = {
      nome_item: novoItem.nome_item,
      quantidade: parseFloat(novoItem.quantidade),
      preco_unitario: parseFloat(novoItem.preco_unitario),
      preco_total: parseFloat(novoItem.quantidade) * parseFloat(novoItem.preco_unitario),
      id_temp: Date.now(),
    };

    setItens([...itens, item]);
    setNovoItem({
      nome_item: "",
      quantidade: "",
      preco_unitario: "",
    });
    toast.success("Item adicionado!");
  };

  const handleRemoverItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
    toast.success("Item removido!");
  };

  const calcularValorTotal = () => {
    return itens.reduce((sum, item) => sum + (item.preco_total || 0), 0);
  };

  const handleSubmit = async () => {
    if (itens.length === 0) {
      toast.error("Adicione pelo menos 1 item à compra");
      return;
    }

    try {
      setLoading(true);

      const valorTotal = calcularValorTotal();

      const dadosCompra = {
        id_estabelecimento: estabelecimento?.id_estabelecimento,
        id_usuario_responsavel: authService.getUsuarioLogado()?.id_usuario,
        nome_compra: formData.nome_compra,
        categoria: formData.categoria,
        data_compra: formData.data_compra,
        descricao: formData.descricao,
        valor_total: valorTotal,
      };

      let compraId;

      if (compra) {
        await compraService.atualizar(compra.id_compra, dadosCompra);
        compraId = compra.id_compra;
        toast.success("Compra atualizada!");
      } else {
        const response = await compraService.criar(dadosCompra);
        compraId = response.compra.id_compra;
        toast.success("Compra criada!");
      }

      for (const item of itens) {
        if (!item.id_item) {
          await itemCompraService.criar(compraId, {
            nome_produto: item.nome_item,
            quantidade: item.quantidade,
            valor_unitario: item.preco_unitario,
            valor_total: item.preco_total,
          });
        }
      }

      onSave();
      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao salvar compra:", err);
      toast.error(err.response?.data?.message || "Erro ao salvar compra");
    } finally {
      setLoading(false);
    }
  };

  const calcularPrecoTotal = () => {
    if (novoItem.quantidade && novoItem.preco_unitario) {
      return (parseFloat(novoItem.quantidade) * parseFloat(novoItem.preco_unitario)).toFixed(2);
    }
    return "0.00";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <span>{compra ? "Editar Compra" : "Nova Compra"}</span>
            <span className="text-sm text-slate-400">
              Etapa {step}/2
            </span>
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome_compra" className="text-white">
                Nome da Compra *
              </Label>
              <Input
                id="nome_compra"
                type="text"
                placeholder="Ex: Compra no Supermercado"
                value={formData.nome_compra}
                onChange={(e) => setFormData({ ...formData, nome_compra: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label htmlFor="categoria" className="text-white">
                Categoria *
              </Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                disabled={loading}
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="supermercado" className="text-white">Supermercado</SelectItem>
                  <SelectItem value="utilidades" className="text-white">Utilidades</SelectItem>
                  <SelectItem value="entretenimento" className="text-white">Entretenimento</SelectItem>
                  <SelectItem value="transporte" className="text-white">Transporte</SelectItem>
                  <SelectItem value="outros" className="text-white">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data_compra" className="text-white">
                Data da Compra *
              </Label>
              <Input
                id="data_compra"
                type="date"
                value={formData.data_compra}
                onChange={(e) => setFormData({ ...formData, data_compra: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-white"
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label htmlFor="descricao" className="text-white">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                placeholder="Observações adicionais..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 min-h-20"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleNextStep}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                disabled={loading}
              >
                Próximo: Adicionar Itens
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="pt-4">
                <h3 className="text-white font-semibold mb-2">Resumo da Compra</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-slate-400">
                    <strong className="text-white">Nome:</strong> {formData.nome_compra}
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-white">Categoria:</strong> {formData.categoria}
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-white">Data:</strong> {new Date(formData.data_compra).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Itens da Compra
              </h3>

              {itens.length > 0 && (
                <div className="space-y-2 mb-4">
                  {itens.map((item, index) => (
                    <Card key={item.id_item || item.id_temp} className="bg-slate-900/50 border-slate-700">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.nome_item}</p>
                          <p className="text-sm text-slate-400">
                            {item.quantidade}x R$ {parseFloat(item.preco_unitario).toFixed(2)} = 
                            <span className="text-orange-400 font-semibold ml-1">
                              R$ {parseFloat(item.preco_total).toFixed(2)}
                            </span>
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoverItem(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-4 space-y-3">
                  <h4 className="text-white font-medium text-sm">Adicionar Item</h4>
                  
                  <Input
                    placeholder="Nome do item *"
                    value={novoItem.nome_item}
                    onChange={(e) => setNovoItem({ ...novoItem, nome_item: e.target.value })}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Quantidade *"
                      value={novoItem.quantidade}
                      onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Preço unit. *"
                      value={novoItem.preco_unitario}
                      onChange={(e) => setNovoItem({ ...novoItem, preco_unitario: e.target.value })}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  {(novoItem.quantidade && novoItem.preco_unitario) && (
                    <p className="text-sm text-slate-400">
                      Total do item: <span className="text-orange-400 font-semibold">R$ {calcularPrecoTotal()}</span>
                    </p>
                  )}

                  <Button
                    onClick={handleAdicionarItem}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">VALOR TOTAL DA COMPRA</span>
                  <span className="text-white text-2xl font-bold">
                    R$ {calcularValorTotal().toFixed(2)}
                  </span>
                </div>
                <p className="text-orange-100 text-sm mt-1">
                  {itens.length} {itens.length === 1 ? 'item' : 'itens'}
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                disabled={loading || itens.length === 0}
              >
                {loading ? "Salvando..." : compra ? "Salvar Alterações" : "Finalizar Compra"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
