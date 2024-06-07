import { useEffect, useRef, useState } from 'react';
import { Instalacion } from '../../types/types';
import { useAuthProvider } from '../../context/useAuthProvider';
import deleteIcon from '/src/assets/icons/delete.svg';
import editIcon from '/src/assets/icons/edit.svg';
import newIcon from '/src/assets/icons/new.svg';

export default function InstallationsAdmin() {
  const { user } = useAuthProvider();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [installations, setInstallations] = useState<Instalacion[] | null>();
  const installationsInfoUpdated = useRef<any>({}); // <{ [key: number]: Instalacion }> así me da fallo en la parte de editInstallation
  const newInstallationInfo = useRef<any>({ id: 1, nombre: '', precioHora: 1 }); // <{ Instalacion }> tb hay que cambiar esto!

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/instalaciones/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setInstallations(data.results);
          data.results.forEach((installation: Instalacion) => {
            installationsInfoUpdated.current[installation.id] = installation;
          });
        }
      });
  }, [refetch]);

  const updateInstallationInfo = (event: any, idInstallation: number) => {
    const propertyName = event.target.name as keyof Instalacion;
    const value = event.target.name === 'precioHora' ? Number(event.target.value) : event.target.value;

    installationsInfoUpdated.current[idInstallation][propertyName] = value;
  };

  const addNewInstallationInfo = (event: any) => {
    const propertyName = event.target.name as keyof Instalacion;
    const value = event.target.name === 'precioHora' ? Number(event.target.value) : event.target.value;

    newInstallationInfo.current[propertyName] = value;
  };

  const handleEditInstallationRequest = (idInstallation: number) => {
    const { nombre, precioHora } = installationsInfoUpdated.current[idInstallation];

    fetch(`${import.meta.env.VITE_API_URL}/instalaciones/edit/${idInstallation}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ nombre, precioHora }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setRefetch((prevState) => !prevState);
        }
      });
  };

  const handleNewInstallationRequest = () => {
    const { nombre, precioHora } = newInstallationInfo.current;

    fetch(`${import.meta.env.VITE_API_URL}/instalaciones/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ nombre, precioHora }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setRefetch((prevState) => !prevState);
        }
      });
  };

  const handleDeleteInstallationRequest = (idInstallation: number) => {
    console.log('DELETE: ', idInstallation);
    fetch(`${import.meta.env.VITE_API_URL}/instalaciones/delete/${idInstallation}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setRefetch((prevState) => !prevState);
        }
      });
  };

  return (
    <>
      <div className="w-full md:w-2/3 lg:w-3/4 mx-auto rounded-lg overflow-x-auto m-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th colSpan={4}>Editar Instalaciones</th>
            </tr>
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio hora
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {installations && (
              <>
                {installations.map((installation, index) => {
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{installation.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="text"
                          name="nombre"
                          style={{ width: 'min-content', minWidth: '20px' }}
                          defaultValue={installationsInfoUpdated.current[installation.id].nombre}
                          onChange={(event) => updateInstallationInfo(event, installation.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="number"
                          name="precioHora"
                          defaultValue={installationsInfoUpdated.current[installation.id].precioHora}
                          onChange={(event) => updateInstallationInfo(event, installation.id)}
                          className="w-20 text-center"
                        />
                      </td>
                      <td className="flex justify-center px-6 py-4 whitespace-nowrap text-center">
                        <img
                          src={editIcon}
                          alt="Edit icon"
                          className="w-10 h10 cursor-pointer"
                          onClick={() => handleEditInstallationRequest(installation.id)}
                        />

                        <img
                          src={deleteIcon}
                          alt="Delete icon"
                          className="w-10 h10 cursor-pointer"
                          onClick={() => handleDeleteInstallationRequest(installation.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-100">
                  <th colSpan={4}>Nueva Instalación</th>
                </tr>
                <tr key={1}>
                  <td className="px-6 py-4 whitespace-nowrap text-center">X</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Gimnasio"
                      defaultValue=""
                      onChange={(event) => addNewInstallationInfo(event)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      name="precioHora"
                      defaultValue={1}
                      onChange={(event) => {
                        addNewInstallationInfo(event);
                      }}
                      className="w-20 text-center"
                    />
                  </td>
                  <td className="flex justify-center px-6 py-4 whitespace-nowrap text-center">
                    <img
                      src={newIcon}
                      alt="New icon"
                      className="w-10 h10 cursor-pointer"
                      onClick={() => handleNewInstallationRequest()}
                    />
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* TODO
- Tipar bien el useRef y no ponerle el any
- Al crear una nueva instalación, reiniciar los campos de texto y precioHora
*/
