/**
 * @fileoverview Componentes Skeleton para loading states
 * @module components/LoadingSkeletons
 * 
 * @description
 * Componentes de placeholder que simulam o layout final enquanto dados carregam.
 * Reduz Cumulative Layout Shift (CLS) e melhora percepção de performance.
 */

import { Card, CardContent, CardHeader } from './dashboard.ui/card';

/**
 * Skeleton base com animação shimmer
 */
function SkeletonBase({ className = '' }) {
  return (
    <div 
      className={`skeleton rounded bg-slate-700/50 ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton para cards de estatísticas (3 cards em grid)
 */
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <SkeletonBase className="h-4 w-24" />
            <SkeletonBase className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <SkeletonBase className="h-8 w-32 mb-2" />
            <SkeletonBase className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Skeleton para card individual de item (mensalidade, pagador, etc)
 */
export function ItemCardSkeleton() {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <SkeletonBase className="h-5 w-40" />
            <SkeletonBase className="h-5 w-16" />
          </div>
          <div className="flex gap-2">
            <SkeletonBase className="h-8 w-8 rounded" />
            <SkeletonBase className="h-8 w-8 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonBase className="h-4 w-12" />
          <SkeletonBase className="h-6 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBase className="h-4 w-4 rounded-full" />
          <SkeletonBase className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBase className="h-4 w-4 rounded-full" />
          <SkeletonBase className="h-4 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton para grid de cards (mensalidades, pagadores)
 * @param {number} count - Número de cards skeleton a exibir
 */
export function ItemCardsGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton para barra de filtros
 */
export function FiltersSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <SkeletonBase className="h-10 flex-1" />
      <SkeletonBase className="h-10 w-full md:w-48" />
      <SkeletonBase className="h-10 w-full md:w-48" />
    </div>
  );
}

/**
 * Skeleton completo para página de listagem
 */
export function PageListSkeleton({ statsCount = 3, itemsCount = 6 }) {
  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-20">
        {/* Header */}
        <div className="space-y-2">
          <SkeletonBase className="h-8 w-64" />
          <SkeletonBase className="h-4 w-48" />
        </div>

        {/* Stats */}
        <StatsCardsSkeleton />

        {/* Filters */}
        <FiltersSkeleton />

        {/* Items Grid */}
        <ItemCardsGridSkeleton count={itemsCount} />
      </div>
    </div>
  );
}

/**
 * Skeleton para componente de paginação
 */
export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <SkeletonBase className="h-8 w-8 rounded" />
      <SkeletonBase className="h-4 w-32" />
      <SkeletonBase className="h-8 w-8 rounded" />
    </div>
  );
}
