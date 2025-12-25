/**
 * @fileoverview Componente de seleção de período
 * @module components/PeriodSelector
 * 
 * @description
 * Componente altamente coeso responsável apenas pela seleção visual de período.
 * Segue o princípio Single Responsibility e possui baixo acoplamento.
 * 
 * Complexidade Ciclomática: 2 (apenas renderização condicional do botão)
 * Coesão: Alta - apenas lógica de apresentação de período
 * Acoplamento: Baixo - recebe tudo via props
 */

import { Card } from "./dashboard.ui/card";
import { Button } from "./dashboard.ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from 'prop-types';

/**
 * Componente de seleção de período mensal
 * 
 * @param {Object} props
 * @param {string} props.monthNameShort - Nome abreviado do mês (ex: "Dez")
 * @param {number} props.year - Ano (ex: 2025)
 * @param {boolean} props.isCurrentMonth - Indica se é o mês atual
 * @param {boolean} props.canGoToNextMonth - Indica se pode navegar para próximo
 * @param {Function} props.onPreviousMonth - Callback para mês anterior
 * @param {Function} props.onNextMonth - Callback para próximo mês
 * @param {Function} props.onCurrentMonth - Callback para mês atual
 */
export function PeriodSelector({
    monthNameShort,
    year,
    isCurrentMonth,
    canGoToNextMonth,
    onPreviousMonth,
    onNextMonth,
    onCurrentMonth,
}) {
    return (
        <Card className="p-4 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <p className="text-slate-400 text-sm mb-2">Período</p>
            
            <div className="flex items-center justify-between mb-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPreviousMonth}
                    className="h-8 w-8 text-slate-400 hover:text-orange-500 hover:bg-slate-700/50 transition-colors active:scale-95"
                    aria-label="Mês anterior"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="text-center min-w-[60px]">
                    <p 
                        key={`${monthNameShort}-${year}`}
                        className="text-white font-medium tabular-nums transition-opacity duration-150"
                    >
                        {monthNameShort}
                    </p>
                    <p className="text-slate-400 text-sm tabular-nums">
                        {year}
                    </p>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onNextMonth}
                    disabled={!canGoToNextMonth}
                    className="h-8 w-8 text-slate-400 hover:text-orange-500 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
                    aria-label="Próximo mês"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {!isCurrentMonth && (
                <Button
                    onClick={onCurrentMonth}
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
                >
                    Mês Atual
                </Button>
            )}
        </Card>
    );
}

PeriodSelector.propTypes = {
    monthNameShort: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    isCurrentMonth: PropTypes.bool.isRequired,
    canGoToNextMonth: PropTypes.bool.isRequired,
    onPreviousMonth: PropTypes.func.isRequired,
    onNextMonth: PropTypes.func.isRequired,
    onCurrentMonth: PropTypes.func.isRequired,
};

/**
 * ANÁLISE DE MÉTRICAS
 * 
 * Complexidade Ciclomática: 2
 * - Apenas renderização condicional do botão "Mês Atual"
 * 
 * Coesão: Alta
 * - Responsabilidade única: apresentação visual do seletor de período
 * - Não contém lógica de negócio
 * 
 * Acoplamento: Baixo
 * - Totalmente controlado por props
 * - Sem dependências externas além de componentes UI
 * - Facilmente reutilizável
 * 
 * Testabilidade: Excelente
 * - Componente puro e previsível
 * - Fácil de testar com Testing Library
 */
