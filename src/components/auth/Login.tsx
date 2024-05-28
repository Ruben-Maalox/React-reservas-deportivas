import logoEmpresa from '../../assets/images/logoMenosTransparencia.png';
import { useState } from 'react';
import { useAuthProvider } from '../../context/useAuthProvider';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import { PacmanLoader } from 'react-spinners';
import { AuthProps } from '../../types/types';

export default function Login({ setShowLogin, setError }: AuthProps) {
  const { setUser } = useAuthProvider();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    fetch('http://localhost:8000/api/login_check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const { email, name, token, picture, surname, phone, id, isAdmin } = data.results;
          setUser({ email, name, token, picture, fromGoogle: false, surname, phone, id, isAdmin });
          window.localStorage.setItem(
            'loggedUser',
            JSON.stringify({ email, name, token, picture, fromGoogle: false, surname, phone, id, isAdmin }),
          );
          navigate('/reservas');
        }
        if (data.error) {
          setError(data.error);
        }
      });
  };

  return isLoading ? (
    <PacmanLoader color={'#123abc'} loading={isLoading} size={70} />
  ) : (
    <div className="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto md:max-w-lg lg:max-w-lg">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center">
          <img src={logoEmpresa} alt="logo" className="mb-10 w-2/3 max-w-xs" />
        </div>
        <h2 className="text-2xl text-center mb-4 font-bold">Iniciar sesión</h2>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="email"
            type="email"
            placeholder="Email"
          />
        </div>
        <div className="mb-6">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            name="password"
            type="password"
            placeholder="Contraseña"
          />
        </div>
        <div className="flex items-center justify-center mb-4">
          <input type="checkbox" id="remember" name="remember" value="remember" className="mr-2" />
          <label className="text-gray-700 text-sm font-bold" htmlFor="remember">
            Recordar inicio de sesión
          </label>
        </div>
        <div className="flex flex-col items-center justify-center mt-3">
          <button className="w-full md:w-1/2 lg:w-1/3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full animate-pulse">
            Entrar
          </button>
        </div>
      </form>
      <GoogleLogin setIsLoading={setIsLoading} />
      <div className="flex flex-col items-center justify-center">
        <p className="text-center mt-4 text-gray-700 font-bold mb-5">¿No tienes cuenta?</p>
        <button
          onClick={() => {
            setShowLogin(false);
          }}
          className="w-full md:w-1/2 lg:w-1/3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
        >
          Regístrate
        </button>
      </div>
    </div>
  );
}
/* TODO:
- Reiniciar los campos del formulario (por lo menos contraseña) cuando haya un error */
