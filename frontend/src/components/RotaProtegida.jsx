import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function RotaProtegida({ children }) {
  const isAutenticado = authService.isAutenticado();
  
  if (!isAutenticado) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
