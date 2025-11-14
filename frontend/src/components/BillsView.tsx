import { BillCard, Bill } from "./BillCard";
import { AddBillDialog } from "./AddBillDialog";
import { Card } from "./dashboard.ui/card";
import { Receipt, DollarSign, AlertCircle, CheckCircle } from "lucide-react";

interface BillsViewProps {
  bills: Bill[];
  onAddBill: (bill: Omit<Bill, "id">) => void;
}

export function BillsView({ bills, onAddBill }: BillsViewProps) {
  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingBills = bills.filter((bill) => bill.status === "pending");
  const paidBills = bills.filter((bill) => bill.status === "paid");
  const overdueBills = bills.filter((bill) => bill.status === "overdue");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Contas do Mês</h2>
          <p className="text-muted-foreground mt-1">Gerencie todas as suas contas e pagamentos</p>
        </div>
        <AddBillDialog onAddBill={onAddBill} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <Receipt className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-foreground">Total</p>
          </div>
          <p className="text-foreground">${totalBills.toFixed(2)}</p>
          <p className="text-muted-foreground mt-1">{bills.length} contas</p>
        </Card>

        <Card className="p-5 bg-amber-500/10 border-amber-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500 rounded-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-foreground">Pendentes</p>
          </div>
          <p className="text-foreground">${pendingBills.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}</p>
          <p className="text-muted-foreground mt-1">{pendingBills.length} contas</p>
        </Card>

        <Card className="p-5 bg-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-foreground">Pagas</p>
          </div>
          <p className="text-foreground">${paidBills.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}</p>
          <p className="text-muted-foreground mt-1">{paidBills.length} contas</p>
        </Card>

        <Card className="p-5 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-foreground">Atrasadas</p>
          </div>
          <p className="text-foreground">${overdueBills.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}</p>
          <p className="text-muted-foreground mt-1">{overdueBills.length} contas</p>
        </Card>
      </div>

      {overdueBills.length > 0 && (
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>Você tem {overdueBills.length} conta(s) atrasada(s) que precisa(m) de atenção!</p>
          </div>
        </Card>
      )}

      <div>
        <h3 className="mb-4">Todas as Contas</h3>
        {bills.length === 0 ? (
          <Card className="p-12 text-center">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhuma conta cadastrada neste mês.</p>
            <p className="text-muted-foreground mt-2">Clique em \"Add Bill\" para adicionar sua primeira conta.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}