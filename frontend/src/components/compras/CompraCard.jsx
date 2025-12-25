import { Card, CardContent, CardHeader, CardTitle } from '../dashboard.ui/card';
import { Button } from '../dashboard.ui/button';
import { Badge } from '../dashboard.ui/badge';
import { Edit, Trash2, Eye, Calendar, Tag } from 'lucide-react';

/**
 * Category configuration for badges
 */
const CATEGORIA_CONFIG = {
  supermercado: { label: 'Supermercado', className: 'bg-green-500/20 text-green-400 border-green-500/50' },
  utilidades: { label: 'Utilidades', className: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
  entretenimento: { label: 'Entretenimento', className: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
  transporte: { label: 'Transporte', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
  outros: { label: 'Outros', className: 'bg-slate-500/20 text-slate-400 border-slate-500/50' },
};

/**
 * CompraCard - Individual compra card component
 * 
 * Single Responsibility: Renders a single compra
 * Props-driven: Easy to test
 */
export default function CompraCard({ compra, onEdit, onDelete, onViewItens }) {
  const categoriaConfig = CATEGORIA_CONFIG[compra.categoria] || CATEGORIA_CONFIG.outros;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-orange-500/50 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">
              {compra.nome_compra || compra.descricao || 'Compra'}
            </CardTitle>
            <Badge className={categoriaConfig.className}>
              {categoriaConfig.label}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewItens(compra)}
              className="text-slate-400 hover:text-blue-400"
              title="Ver itens"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(compra)}
              className="text-slate-400 hover:text-orange-400"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(compra)}
              className="text-slate-400 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Valor Total:</span>
          <span className="text-white font-semibold text-lg">
            R$ {parseFloat(compra.valor_total || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {new Date(compra.data_compra).toLocaleDateString('pt-BR')}
          </span>
        </div>
        {compra.descricao && (
          <div className="flex items-center gap-2 text-slate-400">
            <Tag className="h-4 w-4" />
            <span className="text-sm truncate">{compra.descricao}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
