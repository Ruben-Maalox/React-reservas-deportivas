/*
 * Este componente se utiliza como wrapper para proteger rutas privadas. De esta forma en la App.jsx sería así:  <Route path="/secured" element={<RequireAuth><Secured /></RequireAuth>} />
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProvider } from '../../context/useAuthProvider';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuthProvider();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth-page');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return children;
}
