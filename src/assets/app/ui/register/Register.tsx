"use client";

export default function Register() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value; // Este lo he cambiado porque si pongo form.name me da error
    const surname = (form.surname as HTMLInputElement).value;
    const phone = (form.phone as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

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
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" action="" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Introduce tu nombre
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="name" type="name" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Introduce tus apellidos
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="surname" type="surname" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Introduce tu teléfono
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="phone" type="phone" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Introduce tu email
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" type="email" placeholder="example@gmail.com" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Introduce tu contraseña
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="password" type="password" />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Registrarse
          </button>
        </div>
      </form>
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
