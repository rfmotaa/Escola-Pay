import { Building2, Landmark, CreditCard, Shield } from "lucide-react";
import { Card } from "./home.ui/card";

const partners = [
  {
    name: "Banco Parceiro",
    description: "Processamento de pagamentos",
    icon: Landmark,
  },
  {
    name: "Sistema Educacional",
    description: "Integração com plataformas escolares",
    icon: Building2,
  },
  {
    name: "Gateway de Pagamento",
    description: "Transações seguras",
    icon: CreditCard,
  },
  {
    name: "Segurança Digital",
    description: "Proteção de dados",
    icon: Shield,
  },
];

export function PartnersSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-white mb-3">Nossas Parcerias</h2>
          <p className="text-slate-300">
            Trabalhamos com os melhores do mercado para garantir qualidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <Card
              key={index}
              className="bg-slate-900/60 border-slate-800 backdrop-blur-sm p-6 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <partner.icon className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white mb-1">{partner.name}</h3>
                  <p className="text-slate-400">{partner.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
