import { Card } from "./dashboard.ui/card";
import { Badge } from "./dashboard.ui/badge";
import { ShoppingBag, Calendar, DollarSign } from "lucide-react";

export interface Purchase {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface PurchaseCardProps {
  purchase: Purchase;
}

export function PurchaseCard({ purchase }: PurchaseCardProps) {
  const categoryColors: Record<string, string> = {
    groceries: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    utilities: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    entertainment: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    transport: "bg-primary/20 text-primary border-primary/30",
    other: "bg-secondary/50 text-foreground border-border",
  };

  return (
    <Card className="p-4 hover:shadow-lg hover:shadow-primary/5 transition-all bg-card border-border">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="mb-1 text-foreground">{purchase.name}</h3>
            {purchase.description && (
              <p className="text-muted-foreground">{purchase.description}</p>
            )}
          </div>
        </div>
        <Badge 
          className={categoryColors[purchase.category] || categoryColors.other}
          variant="outline"
        >
          {purchase.category}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between text-muted-foreground mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(purchase.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span>${purchase.amount.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}