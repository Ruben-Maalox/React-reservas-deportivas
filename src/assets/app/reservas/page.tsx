"use client";

import Login from "../ui/login/login";
import Register from "../ui/register/Register";
import { useState } from "react";

export default function ReservasPage() {
  const [shouldShowLogin, setShouldShowLogin] = useState(true);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100 text-black">
      <h1>ESTA ES LA PÁGINA DE RESERVAS</h1>
      <p>En esta página se mostrarán las reservas de la empresa. Pidiendo previamente el Login</p>
      <button onClick={()=>{setShouldShowLogin(!shouldShowLogin)}}>Iniciar sesion?</button>
      {shouldShowLogin && <Login />}
      {shouldShowLogin === false && <Register />}
    </main>
  );
}

/* TODO
- Aquí deberíamos guardar el TOKEN en una cookie o en el navegador para que no se pierda al recargar la página.
*/
