import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dashboard.ui/dialog";
import { Button } from "./dashboard.ui/button";
import { Input } from "./dashboard.ui/input";
import { Label } from "./dashboard.ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./dashboard.ui/select";
import { Plus } from "lucide-react";
import { Bill } from "./BillCard";

interface AddBillDialogProps {
  onAddBill: (bill: Omit<Bill, "id">) => void;
}

export function AddBillDialog({ onAddBill }: AddBillDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    payer: "",
    dueDate: "",
    status: "pending" as Bill["status"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBill({
      name: formData.name,
      amount: parseFloat(formData.amount),
      payer: formData.payer,
      dueDate: formData.dueDate,
      status: formData.status,
    });
    setFormData({
      name: "",
      amount: "",
      payer: "",
      dueDate: "",
      status: "pending",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Bill
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Bill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Bill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Electric Bill"
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="150.00"
              required
            />
          </div>
          <div>
            <Label htmlFor="payer">Payer</Label>
            <Input
              id="payer"
              value={formData.payer}
              onChange={(e) => setFormData({ ...formData, payer: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as Bill["status"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Add Bill</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
