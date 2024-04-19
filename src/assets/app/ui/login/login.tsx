"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    const response = await signIn("credentials", { email, password, redirect: false });

    if (response?.error) {
      // Manejar el error
    } else {
      router.push("/reservas/pistas");
    }
  };

  const shouldShowLogin = !localStorage.getItem("token");

  return (
    <>
      {shouldShowLogin && (
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" action="" onSubmit={handleSubmit}>
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
              Iniciar sesión
            </button>
          </div>
        </form>
      )}
    </>
  );
}

/* TODO:
- Ver dónde guardar el token recibido de la API para futuras peticiones */
