import { Link, useLocation } from "react-router-dom";
import { Card } from "./dashboard.ui/card";
import { Button } from "./dashboard.ui/button";
import { LayoutDashboard, Users, DollarSign, ShoppingCart, Building, LogOut } from "lucide-react";
import { authService } from "../services/auth.service";

export function Sidebar() {
  const location = useLocation();
  const usuario = authService.getUsuarioLogado();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Pagadores", icon: Users, path: "/dashboard/pagadores" },
    { label: "Mensalidades", icon: DollarSign, path: "/dashboard/mensalidades" },
    { label: "Compras", icon: ShoppingCart, path: "/dashboard/compras" },
    { label: "Estabelecimento", icon: Building, path: "/dashboard/estabelecimento" },
  ];

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="w-64 min-h-screen bg-slate-900/60 backdrop-blur-sm border-r border-slate-700/50 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="mb-1 text-white font-semibold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          SchoolManager
        </h1>
        <p className="text-slate-400 text-sm">Gestão Financeira</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 space-y-4">
        <Card className="p-4 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
              {usuario?.nome?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">{usuario?.nome || "Usuário"}</p>
              <p className="text-xs text-slate-400 truncate">{usuario?.email || "email@exemplo.com"}</p>
            </div>
          </div>
        </Card>
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}
