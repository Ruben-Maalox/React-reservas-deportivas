import { useState, useEffect } from 'react';
import { useAuthProvider } from '../context/useAuthProvider';
import backgroundImage from './../assets/images/editarPerfil.jpg';
import { UserEditProps } from '../types/types';

export default function UserEdit() {
  const { user, updateUser } = useAuthProvider();
  const [userN, setUser] = useState<UserEditProps>({
    name: '',
    surname: '',
    phone: '',
    picture: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  const handleInputChange = (event: any) => {
    setUser({ ...userN, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const body = JSON.stringify({
      nombre: userN.name,
      apellidos: userN.surname,
      telefono: userN.phone,
    });

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/update/${user?.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      body,
    });

    if (response.ok) {
      const responseData = await response.json();
      setMessage('Usuario actualizado correctamente');
      setTimeout(() => setMessage(''), 3000);
      const updatedUser = { ...userN, ...responseData };
      updateUser(updatedUser);
      localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
    } else {
      setMessage('Error al actualizar el usuario');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-200"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <form
        className="w-full max-w-lg bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 bg-opacity-90"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-8 text-2xl font-bold text-center text-gray-700">Información personal</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor="name">
            Nombre:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-20"
            type="text"
            name="name"
            value={userN?.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
            Apellidos:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-20"
            type="text"
            name="surname"
            value={userN?.surname}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Teléfono:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-20"
            type="tel"
            name="phone"
            pattern="[0-9]{9}"
            onInvalid={(event) => {
              (event.target as HTMLInputElement).setCustomValidity('Por favor, introduce exactamente 9 números.');
            }}
            onInput={(event) => {
              (event.target as HTMLInputElement).setCustomValidity('');
            }}
            value={userN?.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-20"
            type="email"
            name="email"
            value={user?.email}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          {message && (
            <p
              className={`${message === 'Error al actualizar el usuario' ? 'text-red-500' : 'text-green-500'} font-bold`}
            >
              {message}
            </p>
          )}
          <button
            className="w-28 h-12 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer"
            type="submit"
          >
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
}
