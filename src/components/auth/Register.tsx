import Login from "./ReservationsTable";
import logoEmpresa from "../../assets/images/logoMenosTransparencia.png"
import { useState } from "react";

export default function Register() {
  const [showLogin, setShowLogin] = useState(false); // Nuevo estado para controlar la visualización del componente de Login
  const [errorMessage, setErrorMessage] = useState(""); // Nuevo estado para mostrar mensajes de error
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value; // Este lo he cambiado porque si pongo form.name me da error
    const surname = (form.surname as HTMLInputElement).value;
    const phone = (form.phone as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    const confirmEmail = (form.confirmEmail as HTMLInputElement).value; // Obtén el valor del campo confirmEmail
    const password = (form.password as HTMLInputElement).value;

    // Comprueba si los correos electrónicos coinciden
    if (email !== confirmEmail) {
      // alert("Los correos electrónicos no coinciden");
      setErrorMessage("Los correos electrónicos no coinciden");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return; // Si los correos electrónicos no coinciden, termina la función aquí
    }

    const body = JSON.stringify({ email, password, name, surname, phone });

    const response = await fetch("http://127.0.0.1:8000/api/login_check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (response) {
      const data = await response.json();
      document.cookie = `authToken=${data.token}; path=/; max-age=3600; samesite=strict; secure; httponly`;
      // Para obtener el token de la cookie: const token = getCookie('authToken'); pero copilot dice que al poner httponly no se puede acceder desde el cliente
    }
  };

  return (
    <>
    {showLogin ? <Login /> : (
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-2/6" action="" onSubmit={handleSubmit}>
      <div className="flex items-center justify-center">
              <img src={logoEmpresa} alt="logo" width={250} height={250} className="mb-10" />
          </div>
          <h2 className="text-2xl text-center mb-4 font-bold">Alta de Usuario</h2>
        <div className="mb-4">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Introduce tu nombre
          </label> */}
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" type="name" placeholder="Nombre *" required/>
        </div>
        <div className="mb-4">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Introduce tus apellidos
          </label> */}
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline" name="surname" type="surname" placeholder="Apellidos *" required />
        </div>
        <div className="mb-4">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Introduce tu teléfono
          </label> */}
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline" name="phone" type="phone" placeholder="Móvil *" required />
        </div>
        <div className="mb-4">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Introduce tu email
          </label> */}
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" type="email" placeholder="Correo electrónico *" required />
        </div>
        <div className="mb-4">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmEmail">
            Confirma tu email
          </label> */}
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="confirmEmail" type="email" placeholder="Confirmar correo electrónico *" required />
        </div>
        
        <div className="mb-4">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Introduce tu contraseña
          </label> */}
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="password" type="password" placeholder="Contraseña *" required />
        </div>
        {errorMessage && <p className="text-red-500 mb-5">{errorMessage}</p>}
        <div className="flex flex-col items-center justify-between">
          {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Registrarse
          </button> */}
          <button
               className="w-1/3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce">
                Regístrate
          </button>
        </div>
        <div className="flex flex-col items-center justify-between">
          <p className="text-center mt-4 text-gray-700 font-bold mb-5">
            ¿Ya tienes cuenta? {/* <a href="#" className="text-blue-500">Inicia sesión</a> */}
          </p>
          {/* boton para iniciar sesion */}
          
              <button
                onClick={() => setShowLogin(true)} // Establece showRegistro a false cuando se hace clic en el botón
                className="w-1/3 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce">
                Inicia sesión
              </button>
        </div>
      </form>
    )}
    </>
  );
}

/* TODO: Decidir dónde guardar el token de autenticación y cómo protegerlo contra ataques XSS y CSRF

El token de autenticación se suele guardar en uno de los siguientes lugares:

1. LocalStorage: Es una opción común para almacenar tokens en el lado del cliente. Sin embargo, no es la opción más segura ya que es vulnerable a ataques de Cross-Site Scripting (XSS).

2. SessionStorage: Similar a LocalStorage pero los datos se borran cuando se cierra la sesión del navegador. También es vulnerable a ataques XSS.

❓3. Cookies: Son una opción más segura ya que pueden protegerse contra ataques XSS configurando la cookie como HttpOnly. Sin embargo, las cookies son vulnerables a ataques de Cross-Site Request Forgery (CSRF) a menos que se tomen precauciones adicionales.

4. Memoria: Almacenar el token en la memoria (por ejemplo, en un estado de React o en un Vuex store) es una opción segura contra ataques XSS y CSRF. Sin embargo, el token se perderá si el usuario recarga la página.

En tu caso, estás usando React, por lo que podrías considerar usar el Context API o Redux para almacenar el token. Esto te permitiría acceder al token desde cualquier componente sin tener que pasar el token a través de props. Sin embargo, como mencioné, el token se perderá si el usuario recarga la página.

Si decides almacenar el token en LocalStorage o SessionStorage, asegúrate de limpiarlo cuando el usuario se desconecte. Además, siempre debes asegurarte de que tu sitio esté protegido contra ataques XSS si eliges esta opción.
*/

/* Almacenar el token en las cookies
Para añadir seguridad a la cookie, puedes utilizar los siguientes atributos:

Secure: Este atributo asegura que la cookie solo se envíe a través de una conexión HTTPS segura.

HttpOnly: Este atributo asegura que la cookie no pueda ser accedida por JavaScript en el lado del cliente. Esto puede ayudar a prevenir ataques de Cross-Site Scripting (XSS).

SameSite: Este atributo puede ayudar a prevenir ataques de Cross-Site Request Forgery (CSRF). Puede tener uno de los siguientes valores:

Strict: La cookie solo se enviará si la solicitud se realiza desde el mismo sitio.
Lax: La cookie se enviará con las solicitudes GET de nivel superior y con las solicitudes realizadas en el mismo sitio.
None: La cookie se enviará con todas las solicitudes, tanto las realizadas en el mismo sitio como las de terceros.
*/
