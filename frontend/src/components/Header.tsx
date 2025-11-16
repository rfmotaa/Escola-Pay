import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./dashboard.ui/button";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-white">EscolaPay</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-white hover:text-orange-500 hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => navigate('/cadastro')}
            >
              Começar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
