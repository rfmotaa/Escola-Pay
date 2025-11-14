import { useState } from "react";
import { Button } from "./home.ui/button";
import { Input } from "./home.ui/input";
import { Label } from "./home.ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./home.ui/dialog";
import { toast } from "sonner";
import { ArrowRight, GraduationCap } from "lucide-react";

export function HeroSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    phone: "",
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cadastro realizado com sucesso! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", institution: "", phone: "" });
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInputClick = () => {
    setOpen(true);
  };

  return (
    <section className="container mx-auto px-4 pt-40 pb-24">
      <div className="max-w-5xl mx-auto text-center">
        <div className="space-y-8">
          {/* Logo e Título */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-3">
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
          <div className="max-w-3xl mx-auto">
            <div 
              onClick={handleInputClick}
              className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 cursor-text hover:border-orange-500/50 transition-all duration-300"
            >
              <p className="text-slate-400 text-left">
                Cadastre sua instituição escolar para começar...
              </p>
              <Button
                onClick={handleInputClick}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full h-10 w-10 p-0"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="flex justify-center gap-12 pt-8">
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
          </div>
        </div>
      </div>

      {/* Modal de Cadastro */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Cadastre sua instituição</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">
                Nome completo
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Digite seu nome"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution" className="text-slate-200">
                Instituição escolar
              </Label>
              <Input
                id="institution"
                name="institution"
                type="text"
                placeholder="Nome da escola"
                value={formData.institution}
                onChange={handleChange}
                required
                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-200">
                Telefone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Cadastrar instituição
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}