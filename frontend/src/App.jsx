import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/dashboard.ui/sonner';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import OnboardingEstabelecimento from './pages/OnboardingEstabelecimento';
import Pagadores from './pages/Pagadores';
import Mensalidades from './pages/Mensalidades';
import Compras from './pages/Compras';
import EditarEstabelecimento from './pages/EditarEstabelecimento';
import RotaProtegida from './components/RotaProtegida';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/onboarding" element={
          <RotaProtegida>
            <OnboardingEstabelecimento />
          </RotaProtegida>
        } />
        
        {/* Dashboard routes with shared layout */}
        <Route
          path="/dashboard"
          element={
            <RotaProtegida requireEstabelecimento={true}>
              <DashboardLayout />
            </RotaProtegida>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="pagadores" element={<Pagadores />} />
          <Route path="mensalidades" element={<Mensalidades />} />
          <Route path="compras" element={<Compras />} />
          <Route path="estabelecimento" element={<EditarEstabelecimento />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
