import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dashboard.ui/dialog";
import { Button } from "./dashboard.ui/button";
import { Input } from "./dashboard.ui/input";
import { Label } from "./dashboard.ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./dashboard.ui/select";
import { Textarea } from "./dashboard.ui/textarea";
import { Plus } from "lucide-react";
import { Purchase } from "./PurchaseCard";

interface AddPurchaseDialogProps {
  onAddPurchase: (purchase: Omit<Purchase, "id">) => void;
}

export function AddPurchaseDialog({ onAddPurchase }: AddPurchaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "other",
    date: new Date().toISOString().split('T')[0],
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPurchase({
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description,
    });
    setFormData({
      name: "",
      amount: "",
      category: "other",
      date: new Date().toISOString().split('T')[0],
      description: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Purchase
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Purchase</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="purchase-name">Purchase Name</Label>
            <Input
              id="purchase-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Grocery Shopping"
              required
            />
          </div>
          <div>
            <Label htmlFor="purchase-amount">Amount</Label>
            <Input
              id="purchase-amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="85.50"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="purchase-date">Date</Label>
            <Input
              id="purchase-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any additional details..."
            />
          </div>
          <Button type="submit" className="w-full">Add Purchase</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
