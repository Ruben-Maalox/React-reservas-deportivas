// --> Páginas
import Home from './pages/Home.tsx';
import Instalaciones from './pages/Instalaciones.tsx';
import Reservas from './pages/Reservas.tsx';
import Servicios from './pages/Servicios.tsx';
import Restaurante from './pages/Restaurante.tsx';
import Contacto from './pages/Contacto.tsx';
import PoliticaCookies from './pages/PoliticaCookies.tsx';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad.tsx';
// --> Componentes
import AuthPage from './pages/AuthPage.tsx';
import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import AvisoLegal from './pages/AvisoLegal.tsx';
import UserInfo from './pages/UserInfo.tsx';
import UserEdit from './pages/UserEdit.tsx';
// --> Navegación
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/authProvider.tsx';
import RequireAuth from './components/auth/RequireAuth.tsx';
import AdminPage from './pages/AdminPage.tsx';
import RequireAdmin from './components/auth/RequireAdmin.tsx';

export default function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Header />

          <main className="p-4 flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/instalaciones" element={<Instalaciones />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route
                path="/reservas"
                element={
                  <RequireAuth>
                    <Reservas />
                  </RequireAuth>
                }
              />
              <Route
                path="/user-info"
                element={
                  <RequireAuth>
                    <UserInfo />
                  </RequireAuth>
                }
              />
              <Route
                path="/user-edit"
                element={
                  <RequireAuth>
                    <UserEdit />
                  </RequireAuth>
                }
              />
              <Route
                path="/adminPage"
                element={
                  <RequireAdmin>
                    <AdminPage />
                  </RequireAdmin>
                }
              />
              <Route path="/restaurante" element={<Restaurante />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/politicaCookies" element={<PoliticaCookies />} />
              <Route path="/politicaPrivacidad" element={<PoliticaPrivacidad />} />
              <Route path="/avisoLegal" element={<AvisoLegal />} />
              <Route path="/auth-page" element={<AuthPage />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
