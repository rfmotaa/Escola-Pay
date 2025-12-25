/**
 * @fileoverview Layout compartilhado para páginas do Dashboard
 * @module components/DashboardLayout
 * 
 * @description
 * Mantém a sidebar persistente entre navegações, evitando re-mounts.
 * Adiciona transições suaves para melhorar a experiência de navegação.
 * 
 * Benefícios:
 * - Sidebar não remonta ao trocar de página
 * - Estado do período permanece consistente
 * - Transições suaves entre conteúdos
 * - Redução de layout shift
 */

import { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSideBar from './DashboardSidebar';

/**
 * Context para compartilhar a data selecionada entre páginas
 */
const DateContext = createContext(null);

export function useDashboardDate() {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDashboardDate must be used within DashboardLayout');
  }
  return context;
}

/**
 * Layout que envolve todas as páginas do dashboard
 * Mantém sidebar e estado de período compartilhados
 */
export default function DashboardLayout() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const location = useLocation();
  const mainRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(location.pathname);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  // Trigger animation on route change
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setIsTransitioning(true);
      
      // Scroll to top on page change
      if (mainRef.current) {
        mainRef.current.scrollTop = 0;
      }
      
      // Reset transition state after animation
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 250);
      
      prevPathRef.current = location.pathname;
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex overflow-hidden">
        {/* Background gradient - renderizado uma vez */}
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />
        
        {/* Sidebar persistente */}
        <DashboardSideBar onDateChange={handleDateChange} />
        
        {/* Área de conteúdo - scrollbar única e estável */}
        <main 
          ref={mainRef}
          className="flex-1 relative overflow-y-auto overflow-x-hidden"
        >
          <div className={isTransitioning ? 'page-enter' : ''}>
            <Outlet context={{ selectedDate, handleDateChange }} />
          </div>
        </main>
      </div>
    </DateContext.Provider>
  );
}
