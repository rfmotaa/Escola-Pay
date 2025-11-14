import { PurchaseCard, Purchase } from "./PurchaseCard";
import { AddPurchaseDialog } from "./AddPurchaseDialog";
import { Card } from "./dashboard.ui/card";
import { ShoppingBag, TrendingUp, PieChart } from "lucide-react";

interface PurchasesViewProps {
  purchases: Purchase[];
  onAddPurchase: (purchase: Omit<Purchase, "id">) => void;
}

export function PurchasesView({ purchases, onAddPurchase }: PurchasesViewProps) {
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  
  const categoryTotals = purchases.reduce((acc, purchase) => {
    acc[purchase.category] = (acc[purchase.category] || 0) + purchase.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  
  const categoryNames: Record<string, string> = {
    groceries: "Supermercado",
    utilities: "Utilidades",
    entertainment: "Entretenimento",
    transport: "Transporte",
    other: "Outros",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Compras do Mês</h2>
          <p className="text-muted-foreground mt-1">Acompanhe todos os seus gastos e compras</p>
        </div>
        <AddPurchaseDialog onAddPurchase={onAddPurchase} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-foreground">Total Gasto</p>
          </div>
          <p className="text-foreground">${totalPurchases.toFixed(2)}</p>
          <p className="text-muted-foreground mt-1">{purchases.length} compras</p>
        </Card>

        <Card className="p-5 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-foreground">Média por Compra</p>
          </div>
          <p className="text-foreground">
            ${purchases.length > 0 ? (totalPurchases / purchases.length).toFixed(2) : "0.00"}
          </p>
          <p className="text-muted-foreground mt-1">Ticket médio</p>
        </Card>

        <Card className="p-5 bg-violet-500/10 border-violet-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-500 rounded-lg">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <p className="text-foreground">Maior Categoria</p>
          </div>
          <p className="text-foreground">
            {topCategory ? categoryNames[topCategory[0]] : "N/A"}
          </p>
          <p className="text-muted-foreground mt-1">
            {topCategory ? `$${topCategory[1].toFixed(2)}` : "$0.00"}
          </p>
        </Card>
      </div>

      <div>
        <h3 className="mb-4">Gastos por Categoria</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {Object.entries(categoryTotals).map(([category, total]) => (
            <Card key={category} className="p-4 text-center bg-secondary/50 border-border">
              <p className="text-muted-foreground mb-1">{categoryNames[category]}</p>
              <p className="text-foreground">${total.toFixed(2)}</p>
            </Card>
          ))}
          {Object.keys(categoryTotals).length === 0 && (
            <p className="col-span-5 text-center text-muted-foreground py-4">
              Nenhum gasto registrado ainda
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-4">Histórico de Compras</h3>
        {purchases.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhuma compra registrada neste mês.</p>
            <p className="text-muted-foreground mt-2">Clique em "Add Purchase" para adicionar sua primeira compra.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {purchases
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((purchase) => (
                <PurchaseCard key={purchase.id} purchase={purchase} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}