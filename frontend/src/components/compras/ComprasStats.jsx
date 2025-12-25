import { Card, CardContent, CardHeader, CardTitle } from '../dashboard.ui/card';
import { ShoppingCart } from 'lucide-react';

/**
 * ComprasStats - Statistics cards for the Compras page
 * 
 * Single Responsibility: Only handles statistics display
 * Props-driven: Easy to test and reuse
 */
export default function ComprasStats({ totalMes, numComprasMes, compraMaisCara, totalCompras }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Total Gasto este Mês
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            R$ {totalMes.toFixed(2)}
          </div>
          <p className="text-xs text-orange-100 mt-1">
            {numComprasMes} compras realizadas
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Compras Realizadas
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalCompras}</div>
          <p className="text-xs text-slate-500 mt-1">Total de registros</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Compra Mais Cara
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">
            R$ {compraMaisCara.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
