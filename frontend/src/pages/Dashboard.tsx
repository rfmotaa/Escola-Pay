import '../styles/Dashboard.css';

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bill } from "../components/BillCard";
import { Purchase } from "../components/PurchaseCard";
import { DashboardView } from "../components/DashboardView";
import { BillsView } from "../components/BillsView";
import { PurchasesView } from "../components/PurchasesView";
import { Card } from "../components/dashboard.ui/card";
import { Button } from "../components/dashboard.ui/button";
import { LayoutDashboard, Receipt, ShoppingBag, ChevronLeft, ChevronRight, LogOut, Loader2 } from "lucide-react";
import { authService } from "../services/auth.service";
import { mensalidadeService } from "../services/mensalidade.service";
import { compraService } from "../services/compra.service";

type View = "dashboard" | "bills" | "purchases";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const usuario = authService.getUsuarioLogado();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro("");

      const [mensalidadesData, comprasData] = await Promise.all([
        mensalidadeService.listar(),
        compraService.listar(),
      ]);

      const billsFormatted: Bill[] = mensalidadesData.map((m: any) => ({
        id: m.id_mensalidade.toString(),
        name: m.descricao || "Mensalidade",
        amount: parseFloat(m.valor),
        payer: "Pagador",
        dueDate: m.data_vencimento,
        status: m.status === "pago" ? "paid" : m.status === "atrasado" ? "overdue" : "pending",
      }));

      const purchasesFormatted: Purchase[] = comprasData.map((c: any) => ({
        id: c.id_compra.toString(),
        name: c.descricao || "Compra",
        amount: parseFloat(c.valor_total),
        category: "other",
        date: c.data_compra,
        description: c.descricao || "",
      }));

      setBills(billsFormatted);
      setPurchases(purchasesFormatted);
    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao carregar dados");
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleAddBill = async (newBill: Omit<Bill, "id">) => {
    try {
      await mensalidadeService.criar({
        id_estabelecimento: 1,
        id_pagador: 1,
        valor: newBill.amount,
        data_vencimento: newBill.dueDate,
        status: newBill.status,
        descricao: newBill.name,
      });
      await carregarDados();
    } catch (err) {
      console.error("Erro ao adicionar mensalidade:", err);
    }
  };

  const handleAddPurchase = async (newPurchase: Omit<Purchase, "id">) => {
    try {
      await compraService.criar({
        id_estabelecimento: 1,
        id_usuario_responsavel: usuario?.id_usuario || 1,
        valor_unitario: newPurchase.amount,
        valor_total: newPurchase.amount,
        data_compra: newPurchase.date,
        descricao: newPurchase.name,
      });
      await carregarDados();
    } catch (err) {
      console.error("Erro ao adicionar compra:", err);
    }
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

  if (carregando) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-xl font-semibold text-destructive mb-2">Erro ao carregar</h2>
          <p className="text-muted-foreground mb-4">{erro}</p>
          <Button onClick={carregarDados}>Tentar novamente</Button>
        </Card>
      </div>
    );
  }

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

          <div className="mt-auto pt-6">
            <Card className="p-4 bg-secondary border-border mb-4">
              <p className="text-sm text-muted-foreground mb-1">Usuário</p>
              <p className="font-medium text-foreground">{usuario?.nome || "Usuário"}</p>
            </Card>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
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