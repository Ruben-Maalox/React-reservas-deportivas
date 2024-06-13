import { useState } from 'react';
import NewPassword from './NewPassword';
import logo from '/src/assets/images/logoMenosTransparencia.png';

export interface ForgottenPasswordProps {
  setError: (showError: string) => void;
  showForgottenPassword: (shouldShow: boolean) => void;
}

export default function ForgottenPassword({ setError, showForgottenPassword }: ForgottenPasswordProps) {
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.email as HTMLInputElement).value;

    fetch(`${import.meta.env.VITE_API_URL}/request-reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setNotificationMessage(data.ok);
          setTimeout(() => {
            setShowNewPassword(true);
            setNotificationMessage('');
          }, 3000);
        }
        if (data.error) {
          setError(data.error);
        }
      });
  };

  return (
    <div className="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto">
      {showNewPassword ? (
        <NewPassword showForgottenPassword={showForgottenPassword} setError={setError} />
      ) : (
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center">
            <img src={logo} alt="logo" className="mb-10 w-2/3 sm:w-1/2 md:w-1/2" />
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
            <button className="w-full sm:w-2/3 bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full hover:animate-pulse">
              Enviar
            </button>
          </div>
        </form>
      )}

      <div className="flex items-center justify-center m-4">
        <button
          onClick={() => setShowNewPassword((prevState) => !prevState)}
          className="w-full sm:w-2/3 bg-violet-400 hover:bg-violet-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
        >
          {showNewPassword ? 'Volver a enviar token' : '¿Ya tienes el token?'}
        </button>
      </div>

      <div className="flex items-center justify-center m-4">
        <button
          onClick={() => showForgottenPassword(false)}
          className="w-full sm:w-2/3 bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
        >
          Volver a inicio de sesión
        </button>
      </div>

      <div>
        {notificationMessage && (
          <div
            className="absolute top-0 right-0 m-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg w-1/6"
            role="alert"
          >
            <span className="font-bold block mb-2 sm:inline">{notificationMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
