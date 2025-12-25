/**
 * @fileoverview Testes para o hook usePagination
 * @description TDD - Fase RED: Testes escritos antes da implementação
 * 
 * Cenários de teste:
 * 1. Inicialização correta com itens
 * 2. Cálculo correto do total de páginas
 * 3. Navegação entre páginas
 * 4. Retorno de itens paginados corretos
 * 5. Tratamento de edge cases (lista vazia, página inválida)
 * 6. Reset de página quando itens mudam
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';

describe('usePagination - TDD Suite', () => {
  const mockItems = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

  describe('Inicialização', () => {
    it('deve inicializar na página 1', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));
      
      expect(result.current.currentPage).toBe(1);
    });

    it('deve calcular total de páginas corretamente', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));
      
      // 25 itens / 10 por página = 3 páginas
      expect(result.current.totalPages).toBe(3);
    });

    it('deve retornar os primeiros N itens da página 1', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));
      
      expect(result.current.paginatedItems).toHaveLength(10);
      expect(result.current.paginatedItems[0].id).toBe(1);
      expect(result.current.paginatedItems[9].id).toBe(10);
    });

    it('deve aceitar itemsPerPage customizado', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 5 }));
      
      expect(result.current.paginatedItems).toHaveLength(5);
      expect(result.current.totalPages).toBe(5);
    });
  });

  describe('Navegação', () => {
    it('deve navegar para próxima página', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.paginatedItems[0].id).toBe(11);
    });

    it('deve navegar para página anterior', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

      // Ir para página 2
      act(() => {
        result.current.goToNextPage();
      });

      // Voltar para página 1
      act(() => {
        result.current.goToPrevPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('não deve navegar para página além do total', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

      // Navegar até última página (cada chamada separada para atualizar o estado)
      act(() => {
        result.current.goToNextPage(); // 2
      });
      act(() => {
        result.current.goToNextPage(); // 3
      });
      act(() => {
        result.current.goToNextPage(); // tentativa de 4 (deve permanecer em 3)
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.canGoNext).toBe(false);
    });

    it('não deve navegar para página 0 ou negativa', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

      act(() => {
        result.current.goToPrevPage(); // tentativa, deve permanecer em 1
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.canGoPrev).toBe(false);
    });

    it('deve ir para página específica', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.paginatedItems[0].id).toBe(21);
    });

    it('deve ignorar navegação para página inválida', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

      act(() => {
        result.current.goToPage(99);
      });

      expect(result.current.currentPage).toBe(1); // permanece na página atual
    });
  });

  describe('Estados de navegação', () => {
    it('deve indicar se pode navegar para próxima página', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

      expect(result.current.canGoNext).toBe(true);

      // Ir para última página
      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.canGoNext).toBe(false);
    });

    it('deve indicar se pode navegar para página anterior', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

      expect(result.current.canGoPrev).toBe(false);

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.canGoPrev).toBe(true);
    });
  });

  describe('Informações de paginação', () => {
    it('deve retornar índice inicial corretamente', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

      expect(result.current.startIndex).toBe(0);

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.startIndex).toBe(10);
    });

    it('deve retornar índice final corretamente', () => {
      const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

      expect(result.current.endIndex).toBe(10);

      act(() => {
        result.current.goToPage(3); // última página com 5 itens
      });

      expect(result.current.endIndex).toBe(25);
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com lista vazia', () => {
      const { result } = renderHook(() => usePagination({ items: [], itemsPerPage: 10 }));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.paginatedItems).toEqual([]);
      expect(result.current.canGoNext).toBe(false);
      expect(result.current.canGoPrev).toBe(false);
    });

    it('deve lidar com itens que cabem em uma página', () => {
      const smallList = [{ id: 1 }, { id: 2 }];
      const { result } = renderHook(() => usePagination({ items: smallList, itemsPerPage: 10 }));

      expect(result.current.totalPages).toBe(1);
      expect(result.current.canGoNext).toBe(false);
    });

    it('deve resetar para página 1 quando itens mudam', () => {
      const { result, rerender } = renderHook(
        ({ items }) => usePagination({ items, itemsPerPage: 10 }),
        { initialProps: { items: mockItems } }
      );

      // Navegar para página 2
      act(() => {
        result.current.goToNextPage();
      });
      expect(result.current.currentPage).toBe(2);

      // Mudar itens (simula filtro ou nova busca)
      const newItems = [{ id: 100 }, { id: 101 }];
      rerender({ items: newItems });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.paginatedItems).toHaveLength(2);
    });
  });
});
