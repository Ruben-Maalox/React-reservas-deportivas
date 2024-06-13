import logoEmpresa from '../../assets/images/logoMenosTransparencia.png';
import { useState } from 'react';
import { AuthProps } from '../../types/types';
import { emailRegex } from '../../constants/constants';

export default function Register({ setShowLogin, setError }: AuthProps) {
  const [errorMessage, setErrorMessage] = useState<string>(''); // Nuevo estado para mostrar mensajes de error
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const surname = (form.surname as HTMLInputElement).value;
    const phone = (form.phone as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    const confirmEmail = (form.confirmEmail as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    // Validar correos electrónicos
    if (!emailRegex.test(email)) {
      setErrorMessage('Correo electrónico no válido');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return;
    }

    // Comprueba si los correos electrónicos coinciden
    if (email !== confirmEmail) {
      setErrorMessage('Los correos electrónicos no coinciden');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return;
    }

    const body = JSON.stringify({ email, password, name, surname, phone });

    fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setNotificationMessage(data.ok);
          setTimeout(() => {
            setShowLogin(true);
          }, 7000);
        }
        if (data.error) {
          setError(data.error);
        }
      });
  };

  return (
    <>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center">
          <img src={logoEmpresa} alt="logo" className="mb-10 w-2/3 sm:w-1/2 md:w-1/3" />
        </div>
        <h2 className="text-2xl text-center mb-4 font-bold">Alta de Usuario</h2>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="name"
            type="text"
            placeholder="Nombre *"
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
            name="surname"
            type="text"
            placeholder="Apellidos *"
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="phone"
            type="tel"
            placeholder="Móvil *"
            pattern="[0-9]{9}"
            onInvalid={(event) => {
              (event.target as HTMLInputElement).setCustomValidity('Por favor, introduce exactamente 9 números.');
            }}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="email"
            type="email"
            placeholder="Correo electrónico *"
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="confirmEmail"
            type="email"
            placeholder="Confirmar correo electrónico *"
            required
          />
        </div>

        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            name="password"
            type="password"
            placeholder="Contraseña *"
            required
          />
        </div>
        {errorMessage && <p className="text-red-500 mb-5 text-center font-bold">{errorMessage}</p>}
        <div className="flex flex-col items-center justify-between">
          <button className="w-full sm:w-2/3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce">
            Regístrate
          </button>
        </div>
        <div className="flex flex-col items-center justify-between mt-4">
          <p className="text-center text-gray-700 font-bold mb-5">¿Ya tienes cuenta?</p>
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="w-full sm:w-2/3 bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
          >
            Inicia sesión
          </button>
        </div>
        <div className="flex flex-col justify-start items-center">
          {notificationMessage && (
            <div
              className="m-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg w-auto sm:w-1/2 md:w-1/3 lg:w-full"
              role="alert"
            >
              <span className="font-bold inline mb-2 sm:inline">{notificationMessage}</span>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
