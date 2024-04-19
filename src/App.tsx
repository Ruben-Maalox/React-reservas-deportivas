// --> Páginas
import Home from "./pages/Home.tsx";
import Instalaciones from "./pages/Instalaciones.tsx";
import Reservas from "./pages/Reservas.tsx";
import Servicios from "./pages/Servicios.tsx";
import Restaurante from "./pages/Restaurante.tsx";
import Contacto from "./pages/Contacto.tsx";
// --> Componentes
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";

import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/instalaciones" element={<Instalaciones />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/restaurante" element={<Restaurante />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>
      </BrowserRouter>

      <Footer />
    </>
  );
}
