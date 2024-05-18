import logoEmpresa from '../../assets/images/logoMenosTransparencia.png';
import { useState } from 'react';
import { AuthProps } from '../../types/types';
import { useAuthProvider } from '../../context/useAuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Register({ setShowLogin, setShowError }: AuthProps) {
  const [errorMessage, setErrorMessage] = useState(''); // Nuevo estado para mostrar mensajes de error
  const navigate = useNavigate();
  const { setUser } = useAuthProvider();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value; // Este lo he cambiado porque si pongo form.name me da error
    const surname = (form.surname as HTMLInputElement).value;
    const phone = (form.phone as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    const confirmEmail = (form.confirmEmail as HTMLInputElement).value; // Obtén el valor del campo confirmEmail
    const password = (form.password as HTMLInputElement).value;

    // Comprueba si los correos electrónicos coinciden
    if (email !== confirmEmail) {
      // alert("Los correos electrónicos no coinciden");
      setErrorMessage('Los correos electrónicos no coinciden');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return; // Si los correos electrónicos no coinciden, termina la función aquí
    }

    const body = JSON.stringify({ email, password, name, surname, phone });

    fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const { email, name, token, picture } = data.results;
          setUser({ email, name, token, picture, fromGoogle: false });
          window.localStorage.setItem('loggedUser', JSON.stringify({ email, name, token, picture }));
          navigate('/reservas');
        }
        // Si data.ok no existe (es que hay error) entonces mostramos el error en el componente padre
        setShowError(true);
      });
  };

  return (
    <>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-2/6" action="" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center">
          <img src={logoEmpresa} alt="logo" width={250} height={250} className="mb-10" />
        </div>
        <h2 className="text-2xl text-center mb-4 font-bold">Alta de Usuario</h2>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="name"
            type="name"
            placeholder="Nombre *"
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
            name="surname"
            type="surname"
            placeholder="Apellidos *"
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
            name="phone"
            type="phone"
            placeholder="Móvil *"
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
        {errorMessage && <p className="text-red-500 mb-5">{errorMessage}</p>}
        <div className="flex flex-col items-center justify-between">
          <button className="w-1/3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce">
            Regístrate
          </button>
        </div>
        <div className="flex flex-col items-center justify-between">
          <p className="text-center mt-4 text-gray-700 font-bold mb-5">¿Ya tienes cuenta?</p>
          <button
            onClick={() => setShowLogin(true)} // Establece showRegistro a false cuando se hace clic en el botón
            className="w-1/3 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
          >
            Inicia sesión
          </button>
        </div>
      </form>
    </>
  );
}
