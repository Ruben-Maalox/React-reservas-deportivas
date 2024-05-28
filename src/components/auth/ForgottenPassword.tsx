import { useState } from 'react';
import NewPassword from './NewPassword';

export interface ForgottenPasswordProps {
  setError: (showError: string) => void;
  showForgottenPassword: (shouldShow: boolean) => void;
}

export default function ForgottenPassword({ setError, showForgottenPassword }: ForgottenPasswordProps) {
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.email as HTMLInputElement).value;

    fetch('http://localhost:8000/api/request-reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setShowNewPassword(true);
        }
        if (data.error) {
          setError(data.error);
        }
      });
  };

  return (
    <div className="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-2/6">
      {showNewPassword ? (
        <NewPassword showForgottenPassword={showForgottenPassword} setError={setError} />
      ) : (
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center">
            <img
              src="/src/assets/images/logoMenosTransparencia.png"
              alt="logo"
              width={250}
              height={250}
              className="mb-10"
            />
          </div>
          <h2 className="text-2xl text-center mb-4 font-bold">Restablecer contraseña</h2>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="email"
              type="email"
              placeholder="Email"
            />
          </div>

          <div className="flex flex-col items-center justify-center mt-3">
            <button className="flex bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full animate-pulse">
              Enviar
            </button>
          </div>
        </form>
      )}

      <div className="flex items-center justify-center m-4">
        <button
          onClick={() => setShowNewPassword((prevState) => !prevState)}
          className="flex bg-violet-400 hover:bg-violet-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
        >
          {showNewPassword ? 'Volver a enviar token' : '¿Ya tienes el token?'}
        </button>
      </div>

      <div className="flex items-center justify-center m-4">
        <button
          onClick={() => showForgottenPassword(false)}
          className="flex bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
        >
          Volver a inicio de sesión
        </button>
      </div>
    </div>
  );
}
