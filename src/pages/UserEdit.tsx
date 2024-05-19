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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  const handleInputChange = (event: any) => {
    setUser({ ...userN, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // const handleFileChange = (event: any) => {
  //   setSelectedFile(event.target.files[0]);
  // };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('nombre', userN.name);
    formData.append('apellidos', userN.surname);
    formData.append('telefono', userN.phone);
    if (selectedFile) {
      formData.append('picture', selectedFile);
    }
    // Aquí puedes hacer un fetch para actualizar los datos del usuario
    const response = await fetch(`http://localhost:8000/api/user/update/${user?.id}`, {
      method: 'POST', // Cambiado a POST
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      setMessage('Usuario actualizado correctamente');
      const updatedUser = { ...userN, ...responseData };
      updateUser(updatedUser); // Actualiza el estado del usuario con la respuesta del servidor
      localStorage.setItem('loggedUser', JSON.stringify(updatedUser)); // Actualiza localStorage con la respuesta del servidor
    } else {
      setMessage('Error al actualizar el usuario');
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
        <h2 className="mb-8 text-2xl font-bold text-center text-gray-700">Actualizar perfil</h2>
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
            type="text"
            name="phone"
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
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Foto:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-20"
            type="file"
            name="picture"
            onChange={handleImageChange}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          {message && <p className="text-green-500 font-bold">{message}</p>}
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
