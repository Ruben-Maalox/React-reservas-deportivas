import { useState } from "react";
import logoEmpresa from "../../assets/images/logoMenosTransparencia.png"
import Register from "./Register";
// import Register from "../register/Register";

export default function Login() {
  const [token, setToken] = useState<string>("");
  const [showRegistro, setShowRegistro] = useState<boolean>(false); // Nuevo estado para controlar la visualización del componente de registro

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    const body = JSON.stringify({ email, password });

    const response = await fetch("http://127.0.0.1:8000/api/login_check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (response) {
      const data = await response.json();
      setToken(data.token);
      // <-- Redireccionar a /reservas/pistas
    }
  };

  return (
    <>
      {showRegistro ? (
        <Register /> // Muestra el componente de registro si showRegistro es true
      ) : (token === "" && (
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-2/6" action="" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center">
              <img src={logoEmpresa} alt="logo" width={250} height={250} className="mb-10" />
          </div>
          <h2 className="text-2xl text-center mb-4 font-bold">Iniciar sesión</h2>
          <div className="mb-4">
            {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Introduce tu email
            </label> */}
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" type="email" placeholder="Email" />
          </div>
          <div className="mb-6">
            {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Introduce tu contraseña
            </label> */}
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="password" type="password" placeholder="Contraseña" />
          </div>
          {/* checkbox para recordar inicio de sesion */}
          <div className="flex items-center justify-center">
              <input type="checkbox" id="remember" name="remember" value="remember" className="mb-1" />
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-2" htmlFor="remember">
                  Recordar inicio de sesión
              </label>
          </div>
          
          <div className="flex items-center justify-center mt-3">
              {/* <button className="w-1/3 cursor-pointer transition-all bg-green-500 text-white px-6 py-2 rounded-lg
                        border-green-600
                        border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                  Entrar
              </button> */}
              <button className="w-1/3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full animate-pulse">
                Entrar
              </button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-center mt-4 text-gray-700 font-bold mb-5">
              ¿No tienes cuenta? {/* <a href="#" className="text-blue-500">Regístrate</a> */}
            </p>

              <button
               onClick={() => setShowRegistro(true)} // Establece showRegistro a true cuando se hace clic en el botón
               className="w-1/3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce">
                Regístrate
              </button>

          </div>
        </form>
      )
      )}
    </>
  );
}

/* TODO:
- Ver dónde guardar el token recibido de la API para futuras peticiones
- Ponemos el recordar inicio de sesión en un checkbox??
*/
