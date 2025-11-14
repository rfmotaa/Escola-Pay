import { Bill } from "./BillCard";
import { Purchase } from "./PurchaseCard";
import { Card } from "./dashboard.ui/card";
import { Wallet, Receipt, TrendingDown, DollarSign, Calendar } from "lucide-react";

interface DashboardViewProps {
  bills: Bill[];
  purchases: Purchase[];
  selectedDate: Date;
}

export function DashboardView({ bills, purchases, selectedDate }: DashboardViewProps) {
  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const pendingBills = bills.filter((bill) => bill.status === "pending").length;
  const overdueBills = bills.filter((bill) => bill.status === "overdue").length;
  const totalExpenses = totalBills + totalPurchases;

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const recentBills = bills
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 3);

  const recentPurchases = purchases
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2>Visão Geral</h2>
        <p className="text-muted-foreground mt-1">
          Resumo financeiro de {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-primary to-orange-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <p>Total de Gastos</p>
          </div>
          <p className="mb-1">${totalExpenses.toFixed(2)}</p>
          <p className="opacity-90">Este mês</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <p>Contas</p>
          </div>
          <p className="mb-1">${totalBills.toFixed(2)}</p>
          <p className="opacity-90">{bills.length} contas</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <p>Compras</p>
          </div>
          <p className="mb-1">${totalPurchases.toFixed(2)}</p>
          <p className="opacity-90">{purchases.length} compras</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-red-500 to-rose-600 text-white border-red-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <p>Alertas</p>
          </div>
          <p className="mb-1">{pendingBills + overdueBills}</p>
          <p className="opacity-90">Ações pendentes</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3>Contas Recentes</h3>
            <Receipt className="w-5 h-5 text-muted-foreground" />
          </div>
          {recentBills.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma conta neste mês</p>
          ) : (
            <div className="space-y-3">
              {recentBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="text-foreground">{bill.name}</p>
                    <p className="text-muted-foreground">{bill.payer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground">${bill.amount.toFixed(2)}</p>
                    <p className={`${
                      bill.status === "paid" ? "text-emerald-400" :
                      bill.status === "overdue" ? "text-red-400" :
                      "text-amber-400"
                    }`}>
                      {bill.status === "paid" ? "Pago" :
                       bill.status === "overdue" ? "Atrasado" :
                       "Pendente"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3>Compras Recentes</h3>
            <Wallet className="w-5 h-5 text-muted-foreground" />
          </div>
          {recentPurchases.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma compra neste mês</p>
          ) : (
            <div className="space-y-3">
              {recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="text-foreground">{purchase.name}</p>
                    <p className="text-muted-foreground capitalize">{purchase.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground">${purchase.amount.toFixed(2)}</p>
                    <p className="text-muted-foreground">
                      {new Date(purchase.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {(pendingBills > 0 || overdueBills > 0) && (
        <Card className="p-6 bg-amber-500/10 border-amber-500/20">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-amber-400 mt-1" />
            <div>
              <h3 className="text-foreground mb-2">Atenção Necessária</h3>
              {overdueBills > 0 && (
                <p className="text-amber-300 mb-1">
                  • {overdueBills} conta(s) atrasada(s)
                </p>
              )}
              {pendingBills > 0 && (
                <p className="text-amber-300">
                  • {pendingBills} conta(s) pendente(s) para pagar
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}