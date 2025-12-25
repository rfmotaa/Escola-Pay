import { useNavigate } from "react-router-dom";
import { Button } from "./dashboard.ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 pt-40 pb-24">
      <div className="max-w-5xl mx-auto text-center">
        <div className="space-y-8">
          {/* Logo e Título */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-white text-5xl md:text-6xl">Gerencie com</h1>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                  <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent text-5xl md:text-6xl">
                  EscolaPay
                </h1>
              </div>
            </div>
            
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Desenvolva a gestão financeira da sua escola com simplicidade e eficiência
            </p>
          </div>

          {/* Input falso que abre o modal */}
          <div className="max-w-3xl mx-auto text-[14px] md:text-[16px]">
            <div 
              onClick={() => navigate('/cadastro')}
              className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 md:p-6 cursor-pointer hover:border-orange-500/50 transition-all duration-300"
            >
              <p className="text-slate-400 text-left">
                Cadastre sua instituição escolar para começar...
              </p>
              <Button
                onClick={() => navigate('/cadastro')}
                className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full h-10 w-10 p-0"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Estatísticas */}
          {<div className="flex justify-center gap-12 pt-8">
            <div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">+500</div>
              <div className="text-slate-200">Escolas cadastradas</div>
            </div>
            <div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">R$ 10M+</div>
              <div className="text-slate-200">Transacionados</div>
            </div>
            <div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">98%</div>
              <div className="text-slate-200">Satisfação</div>
            </div>
          </div>}
        </div>
      </div>
    </section>
  );
}