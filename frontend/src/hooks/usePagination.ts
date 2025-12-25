/**
 * @fileoverview Hook customizado para paginação com tipos TypeScript
 * @module hooks/usePagination
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

export interface UsePaginationOptions<T> {
  items: T[];
  itemsPerPage?: number;
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  startIndex: number;
  endIndex: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToPage: (page: number) => void;
  resetPage: () => void;
}

/**
 * Hook para gerenciamento de paginação
 */
export function usePagination<T>({ 
  items, 
  itemsPerPage = 10 
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const prevItemsRef = useRef(items);

  // Reset para página 1 quando itens mudam
  useEffect(() => {
    if (prevItemsRef.current !== items) {
      setCurrentPage(1);
      prevItemsRef.current = items;
    }
  }, [items]);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, items.length);
  }, [startIndex, itemsPerPage, items.length]);

  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const canGoNext = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const canGoPrev = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    startIndex,
    endIndex,
    canGoNext,
    canGoPrev,
    goToNextPage,
    goToPrevPage,
    goToPage,
    resetPage,
  };
}
