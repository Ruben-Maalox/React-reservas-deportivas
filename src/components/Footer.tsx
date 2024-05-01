import {
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineHome,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { Link } from 'react-router-dom';
import "./Footer.css"

export default function Footer() {
  return (
    <footer className="p-5 bg-gray-200 text-white flex flex-col items-start md:flex-row md:justify-between md:items-center">
      <div id="social-ftr" className="flex flex-col items-center mb-4 md:mb-0">
        <img
          src="./src/assets/images/logo-white-transp.png"
          alt="LetsMove"
          className="w-25 h-16"
        />
        <div className="social-networks flex flex-row mt-4">
          <img
            src="./src/assets/icons/facebook.svg"
            alt="Facebook"
            className="w-4 h-4 mr-2"
          />
          <img
            src="./src/assets/icons/instagram.svg"
            alt="Instagram"
            className="w-4 h-4 mr-2"
          />
          <img
            src="./src/assets/icons/twitter.svg"
            alt="twitter"
            className="w-4 h-4 mr-2"
          />
          <img
            src="./src/assets/icons/tiktok.svg"
            alt="tiktok"
            className="w-4 h-4"
          />
        </div>
      </div>
      {/* Añadir enlaces politica de cookies, privacidad, aviso legal. */}
      <div className="legal-links flex flex-col text-black mb-4 md:mb-0">
        <Link to="/politicaCookies">Política de cookies</Link>
        <Link to="/politicaPrivacidad" className="mt-2">Política de privacidad</Link>
        <Link to="/avisoLegal" className="mt-2">Aviso legal</Link>
      </div>
      <div className="mt-5 text-black mb-4 md:mb-0">
        <h2 className="font-bold text-lg mb-2">Horario:</h2>
        <p className="mb-1">
          <AiOutlineClockCircle className="inline-block mr-1" />
          <span className="font-bold">Lunes - Viernes:</span> 9:00 - 23:00
        </p>
        <p className="mb-1">
          <AiOutlineClockCircle className="inline-block mr-1" />
          <span className="font-bold">Sábado:</span> 10:00 - 14:00
        </p>
        <p className="mb-1">
          <AiOutlineClockCircle className="inline-block mr-1" />
          <span className="font-bold">Domingo:</span> Cerrado
        </p>
      </div>
      {/* CONTACTO */}
      <div className="contacto flex flex-col text-black mb-4 md:mb-0">
        <h2 className="font-bold text-lg mb-2">Contacto:</h2>
        <p className="mb-2">
          <AiOutlinePhone className="inline-block mr-1" />
          <span className="font-bold">Teléfono:</span> 968 111 111 - 637 111 111
        </p>
        <p className="mb-2">
          <AiOutlineMail className="inline-block mr-1" />
          <span className="font-bold">Email:</span> letsmove@letsmove.com
        </p>
        <p className="mb-2">
          <AiOutlineHome className="inline-block mr-1" />
          <span className="font-bold">Dirección:</span> C. Maestro Pedro Perez
          Abadia, 2A, 30100 Espinardo, Murcia
        </p>
      </div>
    </footer>
  );
}
