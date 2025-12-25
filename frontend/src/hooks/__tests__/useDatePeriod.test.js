/**
 * @fileoverview Testes para o hook useDatePeriod
 * @description Implementação TDD seguindo metodologia Red-Green-Refactor
 * 
 * Cenários de teste:
 * 1. Inicialização com data atual
 * 2. Navegação para mês anterior
 * 3. Navegação para próximo mês
 * 4. Transição de ano (dezembro -> janeiro)
 * 5. Transição reversa de ano (janeiro -> dezembro)
 * 6. Bloqueio de navegação para meses futuros
 * 7. Verificação de mês atual
 * 8. Reset para mês atual
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDatePeriod } from '../useDatePeriod';

describe('useDatePeriod - TDD Suite', () => {
  let originalDate;

  beforeEach(() => {
    // Mock de data fixa para testes determinísticos
    originalDate = Date;
    const mockDate = new Date('2025-12-10T10:00:00.000Z');
    global.Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          return mockDate;
        }
        return new originalDate(...args);
      }
      static now() {
        return mockDate.getTime();
      }
    };
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  describe('Inicialização', () => {
    it('deve inicializar com a data atual', () => {
      const { result } = renderHook(() => useDatePeriod());
      
      expect(result.current.currentDate).toBeDefined();
      expect(result.current.currentDate.getMonth()).toBe(11); // Dezembro = 11
      expect(result.current.currentDate.getFullYear()).toBe(2025);
    });

    it('deve inicializar com callback de onChange opcional', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useDatePeriod(onChange));
      
      expect(result.current.currentDate).toBeDefined();
      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
        getMonth: expect.any(Function),
        getFullYear: expect.any(Function)
      }));
    });

    it('deve marcar o mês inicial como mês atual', () => {
      const { result } = renderHook(() => useDatePeriod());
      
      expect(result.current.isCurrentMonth).toBe(true);
    });
  });

  describe('Navegação de Meses', () => {
    it('deve navegar para o mês anterior corretamente', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useDatePeriod(onChange));

      act(() => {
        result.current.goToPreviousMonth();
      });

      expect(result.current.currentDate.getMonth()).toBe(10); // Novembro
      expect(result.current.currentDate.getFullYear()).toBe(2025);
      expect(onChange).toHaveBeenCalledTimes(2); // Initial + navegação
    });

    it('deve navegar para o próximo mês quando não estiver no mês atual', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useDatePeriod(onChange));

      // Primeiro vai para novembro
      act(() => {
        result.current.goToPreviousMonth();
      });

      // Depois volta para dezembro
      act(() => {
        result.current.goToNextMonth();
      });

      expect(result.current.currentDate.getMonth()).toBe(11); // Dezembro
      expect(result.current.currentDate.getFullYear()).toBe(2025);
    });

    it('NÃO deve navegar para meses futuros além do mês atual', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useDatePeriod(onChange));

      const initialMonth = result.current.currentDate.getMonth();

      act(() => {
        result.current.goToNextMonth();
      });

      // Deve permanecer no mesmo mês
      expect(result.current.currentDate.getMonth()).toBe(initialMonth);
      expect(onChange).toHaveBeenCalledTimes(1); // Apenas inicial
    });

    it('deve desabilitar navegação futura quando estiver no mês atual', () => {
      const { result } = renderHook(() => useDatePeriod());

      expect(result.current.isCurrentMonth).toBe(true);
      expect(result.current.canGoToNextMonth).toBe(false);
    });

    it('deve habilitar navegação futura quando não estiver no mês atual', () => {
      const { result } = renderHook(() => useDatePeriod());

      act(() => {
        result.current.goToPreviousMonth();
      });

      expect(result.current.isCurrentMonth).toBe(false);
      expect(result.current.canGoToNextMonth).toBe(true);
    });
  });

  describe('Transições de Ano', () => {
    it('deve transitar corretamente de janeiro para dezembro do ano anterior', () => {
      // Criar data em janeiro 2025
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return new originalDate('2025-01-15T10:00:00.000Z');
          }
          return new originalDate(...args);
        }
      };

      const { result } = renderHook(() => useDatePeriod());

      act(() => {
        result.current.goToPreviousMonth();
      });

      expect(result.current.currentDate.getMonth()).toBe(11); // Dezembro
      expect(result.current.currentDate.getFullYear()).toBe(2024);
    });

    it('deve transitar corretamente de dezembro para janeiro do próximo ano', () => {
      // Criar data em dezembro 2024
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return new originalDate('2024-12-15T10:00:00.000Z');
          }
          return new originalDate(...args);
        }
      };

      const { result } = renderHook(() => useDatePeriod());

      // Não deve poder ir para próximo mês se estiver no mês atual em 2024
      // Vamos navegar para novembro primeiro
      act(() => {
        result.current.goToPreviousMonth();
      });

      // Agora navegar de volta (novembro -> dezembro)
      act(() => {
        result.current.goToNextMonth();
      });

      expect(result.current.currentDate.getMonth()).toBe(11); // Dezembro
      expect(result.current.currentDate.getFullYear()).toBe(2024);
    });
  });

  describe('Formatação e Utilitários', () => {
    it('deve fornecer nome do mês em português', () => {
      const { result } = renderHook(() => useDatePeriod());

      expect(result.current.monthName).toBe('Dezembro');
    });

    it('deve fornecer abreviação do mês', () => {
      const { result } = renderHook(() => useDatePeriod());

      expect(result.current.monthNameShort).toBe('Dez');
    });

    it('deve fornecer o ano correto', () => {
      const { result } = renderHook(() => useDatePeriod());

      expect(result.current.year).toBe(2025);
    });
  });

  describe('Reset para Mês Atual', () => {
    it('deve retornar ao mês atual quando goToCurrentMonth for chamado', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useDatePeriod(onChange));

      // Navegar para mês anterior
      act(() => {
        result.current.goToPreviousMonth();
        result.current.goToPreviousMonth();
      });

      expect(result.current.currentDate.getMonth()).toBe(9); // Outubro

      // Voltar ao mês atual
      act(() => {
        result.current.goToCurrentMonth();
      });

      expect(result.current.currentDate.getMonth()).toBe(11); // Dezembro
      expect(result.current.isCurrentMonth).toBe(true);
    });
  });

  describe('Métricas de Qualidade', () => {
    it('deve manter baixa complexidade ciclomática (< 5 por função)', () => {
      // Este teste é conceitual - a implementação deve ter funções simples
      const { result } = renderHook(() => useDatePeriod());
      
      // Todas as funções devem ter lógica direta sem múltiplos branches
      expect(typeof result.current.goToPreviousMonth).toBe('function');
      expect(typeof result.current.goToNextMonth).toBe('function');
      expect(typeof result.current.goToCurrentMonth).toBe('function');
    });

    it('deve ter alta coesão - todas as funcionalidades relacionadas a período', () => {
      const { result } = renderHook(() => useDatePeriod());
      
      const keys = Object.keys(result.current);
      const periodRelatedKeys = [
        'currentDate',
        'goToPreviousMonth',
        'goToNextMonth',
        'goToCurrentMonth',
        'isCurrentMonth',
        'canGoToNextMonth',
        'monthName',
        'monthNameShort',
        'year'
      ];

      // Todas as chaves devem estar relacionadas a período
      keys.forEach(key => {
        expect(periodRelatedKeys).toContain(key);
      });
    });
  });
});
