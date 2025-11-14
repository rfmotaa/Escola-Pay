import '../styles/Home.css';

import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { PartnersSection } from "../components/PartnersSection";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900">
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/30 via-purple-600/20 to-transparent opacity-50 blur-3xl" />
      
      <div className="relative">
        <Header />
        <HeroSection />
        <PartnersSection />
      </div>
    </div>
  );
}