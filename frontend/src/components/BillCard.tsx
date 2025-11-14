import { Card } from "./dashboard.ui/card";
import { Badge } from "./dashboard.ui/badge";
import { Calendar, User, DollarSign } from "lucide-react";

export interface Bill {
  id: string;
  name: string;
  amount: number;
  payer: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

interface BillCardProps {
  bill: Bill;
  onStatusChange?: (id: string, status: Bill["status"]) => void;
}

export function BillCard({ bill, onStatusChange }: BillCardProps) {
  const statusColors = {
    paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    overdue: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <Card className="p-4 hover:shadow-lg hover:shadow-primary/5 transition-all bg-card border-border">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="mb-1 text-foreground">{bill.name}</h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>${bill.amount.toFixed(2)}</span>
          </div>
        </div>
        <Badge 
          className={statusColors[bill.status]}
          variant="outline"
        >
          {bill.status}
        </Badge>
      </div>
      
      <div className="space-y-2 text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{bill.payer}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
}