import { Input } from '../dashboard.ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../dashboard.ui/select';
import { Search } from 'lucide-react';

/**
 * ComprasFilters - Search and category filter controls
 * 
 * Single Responsibility: Only handles filter UI
 */
export default function ComprasFilters({ 
  searchTerm, 
  onSearchChange, 
  categoriaFilter, 
  onCategoriaChange 
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>

      <Select value={categoriaFilter} onValueChange={onCategoriaChange}>
        <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700 text-white">
          <SelectValue placeholder="Filtrar por categoria" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          <SelectItem value="todas" className="text-white">Todas</SelectItem>
          <SelectItem value="supermercado" className="text-white">Supermercado</SelectItem>
          <SelectItem value="utilidades" className="text-white">Utilidades</SelectItem>
          <SelectItem value="entretenimento" className="text-white">Entretenimento</SelectItem>
          <SelectItem value="transporte" className="text-white">Transporte</SelectItem>
          <SelectItem value="outros" className="text-white">Outros</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
