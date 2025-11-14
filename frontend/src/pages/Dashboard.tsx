import '../styles/Dashboard.css';

import { useState, useMemo } from "react";
import { Bill } from "../components/BillCard";
import { Purchase } from "../components/PurchaseCard";
import { DashboardView } from "../components/DashboardView";
import { BillsView } from "../components/BillsView";
import { PurchasesView } from "../components/PurchasesView";
import { Card } from "../components/dashboard.ui/card";
import { Button } from "../components/dashboard.ui/button";
import { LayoutDashboard, Receipt, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

const initialBills: Bill[] = [
  {
    id: "1",
    name: "Electric Bill",
    amount: 150.50,
    payer: "John Doe",
    dueDate: "2025-11-15",
    status: "pending",
  },
  {
    id: "2",
    name: "Internet Service",
    amount: 79.99,
    payer: "Jane Smith",
    dueDate: "2025-11-20",
    status: "paid",
  },
  {
    id: "3",
    name: "Water Bill",
    amount: 45.00,
    payer: "John Doe",
    dueDate: "2025-11-05",
    status: "overdue",
  },
  {
    id: "4",
    name: "Phone Bill",
    amount: 65.00,
    payer: "Jane Smith",
    dueDate: "2025-11-25",
    status: "pending",
  },
  {
    id: "5",
    name: "Electric Bill",
    amount: 145.00,
    payer: "John Doe",
    dueDate: "2025-10-15",
    status: "paid",
  },
  {
    id: "6",
    name: "Internet Service",
    amount: 79.99,
    payer: "Jane Smith",
    dueDate: "2025-10-20",
    status: "paid",
  },
  {
    id: "7",
    name: "Rent",
    amount: 1200.00,
    payer: "John Doe",
    dueDate: "2025-12-01",
    status: "pending",
  },
];

const initialPurchases: Purchase[] = [
  {
    id: "1",
    name: "Grocery Shopping",
    amount: 125.40,
    category: "groceries",
    date: "2025-11-08",
    description: "Weekly groceries from Whole Foods",
  },
  {
    id: "2",
    name: "Movie Tickets",
    amount: 35.00,
    category: "entertainment",
    date: "2025-11-07",
    description: "2 tickets for the new movie",
  },
  {
    id: "3",
    name: "Gas Station",
    amount: 52.30,
    category: "transport",
    date: "2025-11-06",
  },
  {
    id: "4",
    name: "Coffee Shop",
    amount: 12.50,
    category: "other",
    date: "2025-11-09",
    description: "Morning coffee and pastry",
  },
  {
    id: "5",
    name: "Grocery Shopping",
    amount: 98.20,
    category: "groceries",
    date: "2025-10-22",
    description: "Weekly groceries",
  },
  {
    id: "6",
    name: "Restaurant",
    amount: 65.00,
    category: "entertainment",
    date: "2025-10-18",
  },
  {
    id: "7",
    name: "Amazon Purchase",
    amount: 145.00,
    category: "other",
    date: "2025-12-02",
    description: "Holiday gifts",
  },
];

type View = "dashboard" | "bills" | "purchases";

export default function Dashboard() {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("dashboard");

  const handleAddBill = (newBill: Omit<Bill, "id">) => {
    const bill: Bill = {
      ...newBill,
      id: Date.now().toString(),
    };
    setBills([bill, ...bills]);
  };

  const handleAddPurchase = (newPurchase: Omit<Purchase, "id">) => {
    const purchase: Purchase = {
      ...newPurchase,
      id: Date.now().toString(),
    };
    setPurchases([purchase, ...purchases]);
  };

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setSelectedDate(new Date());
  };

  const isCurrentMonth = 
    selectedDate.getMonth() === new Date().getMonth() &&
    selectedDate.getFullYear() === new Date().getFullYear();

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const billDate = new Date(bill.dueDate);
      return (
        billDate.getMonth() === selectedDate.getMonth() &&
        billDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [bills, selectedDate]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.date);
      return (
        purchaseDate.getMonth() === selectedDate.getMonth() &&
        purchaseDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [purchases, selectedDate]);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const navItems = [
    { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
    { id: "bills" as View, label: "Contas", icon: Receipt },
    { id: "purchases" as View, label: "Compras", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="w-64 min-h-screen bg-card border-r border-border p-6">
          <div className="mb-8">
            <h1 className="mb-1 text-foreground">Finance Manager</h1>
            <p className="text-muted-foreground">Gestão Financeira</p>
          </div>

          <nav className="space-y-2 mb-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <Card className="p-4 bg-secondary border-border">
            <p className="text-muted-foreground mb-2">Período</p>
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousMonth}
                className="h-8 w-8 text-foreground hover:text-primary"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <p className="text-foreground">
                  {monthNames[selectedDate.getMonth()].substring(0, 3)}
                </p>
                <p className="text-muted-foreground">
                  {selectedDate.getFullYear()}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextMonth}
                className="h-8 w-8 text-foreground hover:text-primary"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {!isCurrentMonth && (
              <Button onClick={goToCurrentMonth} variant="outline" size="sm" className="w-full">
                Mês Atual
              </Button>
            )}
          </Card>
        </div>

        <div className="flex-1 p-8 bg-background">
          {currentView === "dashboard" && (
            <DashboardView
              bills={filteredBills}
              purchases={filteredPurchases}
              selectedDate={selectedDate}
            />
          )}
          {currentView === "bills" && (
            <BillsView bills={filteredBills} onAddBill={handleAddBill} />
          )}
          {currentView === "purchases" && (
            <PurchasesView purchases={filteredPurchases} onAddPurchase={handleAddPurchase} />
          )}
        </div>
      </div>
    </div>
  );
}