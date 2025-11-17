import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card } from "../components/dashboard.ui/card";
import { Button } from "../components/dashboard.ui/button";
import { ChevronLeft, ChevronRight, LogOut, Menu, X } from "lucide-react";
import { LayoutDashboard, Users, DollarSign, ShoppingCart, Building } from "lucide-react";
import { authService } from "../services/auth.service";

export default function DashboardSideBar({ onDateChange }) {
    const usuario = authService.getUsuarioLogado();
    const location = useLocation();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

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

    useEffect(() => {
        if (selectedDate)
            onDateChange(selectedDate);
    }, [selectedDate])

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

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    return (
        <>
            {/* BOTÃO HAMBÚRGUER (MOBILE) */}
            <button
                className="md:hidden fixed top-4 right-4 z-50 bg-slate-900/80 p-2 rounded-lg border border-slate-700 text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* SIDEBAR */}
            <div
                className={`
                    fixed md:static top-0 left-0 h-screen w-64
                    bg-slate-900/60 backdrop-blur-sm border-r border-slate-700/50 p-6
                    transform transition-transform duration-300 z-40
                    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="mb-8">
                    <h1 className="mb-1 text-white font-semibold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Finance Manager
                    </h1>
                    <p className="text-slate-400 text-sm">Gestão Financeira</p>
                </div>

                <nav className="space-y-2 mb-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)} // fecha no mobile
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

                <Card className="p-4 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                    <p className="text-slate-400 text-sm mb-2">Período</p>
                    <div className="flex items-center justify-between mb-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToPreviousMonth}
                            className="h-8 w-8 text-slate-400 hover:text-orange-500 hover:bg-slate-700/50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="text-center">
                            <p className="text-white font-medium">
                                {monthNames[selectedDate.getMonth()].substring(0, 3)}
                            </p>
                            <p className="text-slate-400 text-sm">
                                {selectedDate.getFullYear()}
                            </p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToNextMonth}
                            className="h-8 w-8 text-slate-400 hover:text-orange-500 hover:bg-slate-700/50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {!isCurrentMonth && (
                        <Button
                            onClick={goToCurrentMonth}
                            variant="outline"
                            size="sm"
                            className="w-full border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                        >
                            Mês Atual
                        </Button>
                    )}
                </Card>

                <div className="mt-auto pt-6 space-y-4">
                    <Card className="p-4 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
                                {usuario?.nome?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white text-sm truncate">
                                    {usuario?.nome || "Usuário"}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {usuario?.email || "email@exemplo.com"}
                                </p>
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
        </>
    );
}
