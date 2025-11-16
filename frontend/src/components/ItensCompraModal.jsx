import { useState, useEffect } from "react";
import { itemCompraService } from "../services/itemCompra.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dashboard.ui/dialog";
import { Button } from "./dashboard.ui/button";
import { Card, CardContent } from "./dashboard.ui/card";
import { toast } from "sonner";
import { ShoppingCart, Package } from "lucide-react";

export default function ItensCompraModal({ open, onOpenChange, compra }) {
  const [loading, setLoading] = useState(false);
  const [itens, setItens] = useState([]);

  useEffect(() => {
    if (open && compra) {
      carregarItens();
    }
  }, [open, compra]);

  const carregarItens = async () => {
    try {
      setLoading(true);
      const data = await itemCompraService.listar(compra.id_compra);
      setItens(data || []);
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
      toast.error("Erro ao carregar itens da compra");
      setItens([]);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    return itens.reduce((sum, item) => sum + parseFloat(item.valor_total || 0), 0);
  };

  const getCategoriaLabel = (categoria) => {
    const labels = {
      supermercado: "Supermercado",
      utilidades: "Utilidades",
      entretenimento: "Entretenimento",
      transporte: "Transporte",
      outros: "Outros",
    };
    return labels[categoria] || categoria;
  };

  if (!compra) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Detalhes da Compra
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div>
                  <h3 className="text-white font-semibold text-lg">{compra.nome_compra}</h3>
                  <p className="text-slate-400 text-sm">
                    {getCategoriaLabel(compra.categoria)} • {new Date(compra.data_compra).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {compra.descricao && (
                  <p className="text-slate-400 text-sm border-t border-slate-700 pt-2 mt-2">
                    {compra.descricao}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Itens da Compra
            </h3>

            {loading ? (
              <div className="text-center py-8 text-slate-400">
                Carregando itens...
              </div>
            ) : itens.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="py-8 text-center">
                  <Package className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Nenhum item cadastrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-slate-400 border-b border-slate-700">
                  <div className="col-span-5">Item</div>
                  <div className="col-span-2 text-center">Qtd</div>
                  <div className="col-span-2 text-right">Preço Unit.</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                {itens.map((item) => (
                  <Card key={item.id_item_compra} className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
                        <div className="md:col-span-5">
                          <p className="text-white font-medium">{item.nome_produto}</p>
                        </div>
                        <div className="md:col-span-2 md:text-center">
                          <span className="text-slate-400 md:hidden">Quantidade: </span>
                          <span className="text-white">{item.quantidade}</span>
                        </div>
                        <div className="md:col-span-2 md:text-right">
                          <span className="text-slate-400 md:hidden">Preço unitário: </span>
                          <span className="text-white">R$ {parseFloat(item.valor_unitario).toFixed(2)}</span>
                        </div>
                        <div className="md:col-span-3 md:text-right">
                          <span className="text-slate-400 md:hidden">Total: </span>
                          <span className="text-orange-400 font-semibold">
                            R$ {parseFloat(item.valor_total).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {itens.length > 0 && (
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-lg">Total da Compra</p>
                    <p className="text-orange-100 text-sm">
                      {itens.length} {itens.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                  <span className="text-white text-3xl font-bold">
                    R$ {calcularTotal().toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-slate-700 hover:bg-slate-600 text-white"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
