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
        <Route
          path="/dashboard"
          element={
            <RotaProtegida requireEstabelecimento={true}>
              <Dashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/dashboard/pagadores"
          element={
            <RotaProtegida requireEstabelecimento={true}>
              <Pagadores />
            </RotaProtegida>
          }
        />
        <Route
          path="/dashboard/mensalidades"
          element={
            <RotaProtegida requireEstabelecimento={true}>
              <Mensalidades />
            </RotaProtegida>
          }
        />
        <Route
          path="/dashboard/compras"
          element={
            <RotaProtegida requireEstabelecimento={true}>
              <Compras />
            </RotaProtegida>
          }
        />
        <Route
          path="/dashboard/estabelecimento"
          element={
            <RotaProtegida requireEstabelecimento={true}>
              <EditarEstabelecimento />
            </RotaProtegida>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
