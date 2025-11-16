import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function RotaProtegida({ children, requireEstabelecimento = false }) {
  const isAutenticado = authService.isAutenticado();
  const temEstabelecimento = authService.getTemEstabelecimento();
  
  if (!isAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (requireEstabelecimento && !temEstabelecimento) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
}
