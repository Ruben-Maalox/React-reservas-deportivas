import logoEmpresa from '../../assets/images/logoMenosTransparencia.png';
import { useState } from 'react';
import { useAuthProvider } from '../../context/useAuthProvider';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import { PacmanLoader } from 'react-spinners';
import { AuthProps } from '../../types/types';

export default function Login({ setShowLogin, setShowError }: AuthProps) {
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
          const { email, name, token, picture, surname, phone, id } = data.results;
          setUser({ email, name, token, picture, fromGoogle: false, surname, phone, id });
          window.localStorage.setItem(
            'loggedUser',
            JSON.stringify({ email, name, token, picture, surname, phone, id }),
          );
          navigate('/reservas');
        }

        setShowError(true);
      });
    /*  Me estuvo fallando el servidor (no me hacía peticiones) asi que tuve que pasar del Login (lo dejo comentado por si vuelve a ocurrir para poder trabajar xd)    
    setUser({ email: "j@gmail.com", name: "juan", token: "dsfsdfsd", picture: null, fromGoogle: false });
    window.localStorage.setItem("loggedUser", JSON.stringify({ email: "j@gmail.com", name: "juan", token: "dsfsdfsd", picture: null, fromGoogle: false }));
    navigate("/reservas"); */
  };

  return isLoading ? (
    <PacmanLoader color={'#123abc'} loading={isLoading} size={70} />
  ) : (
    <div className="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-2/6">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center">
          <img src={logoEmpresa} alt="logo" width={250} height={250} className="mb-10" />
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
        {/* checkbox para recordar inicio de sesion */}
        <div className="flex items-center justify-center">
          <input type="checkbox" id="remember" name="remember" value="remember" className="mb-1" />
          <label className="block text-gray-700 text-sm font-bold mb-2 ml-2" htmlFor="remember">
            Recordar inicio de sesión
          </label>
        </div>

        <div className="flex flex-col items-center justify-center mt-3">
          <button className="w-1/3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full animate-pulse">
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
          className="w-1/3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
        >
          Regístrate
        </button>
      </div>
    </div>
  );
}
/* TODO:
- Reiniciar los campos del formulario (por lo menos contraseña) cuando haya un error */
