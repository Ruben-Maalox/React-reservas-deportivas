import { useEffect, useMemo, useState } from 'react';
import { useAuthProvider } from '../../context/useAuthProvider';
import { Reserva } from '../../types/types';
import { format } from 'date-fns';

export default function ReservationsAdmin() {
  const { user } = useAuthProvider();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [reservations, setReservations] = useState<Reserva[] | null>();
  const [sortOptions, setSortOptions] = useState<any>({ fecha: false }); // , importe: false, duracion: false

  useEffect(() => {
    fetch('http://localhost:8000/api/reservas/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setReservations(data.results);
        }
      });
  }, [refetch]);

  const sortedReservations = useMemo(() => {
    if (reservations) {
      return [...reservations].sort((a, b) => {
        if (sortOptions.fecha) {
          return new Date(a.fechaYHora).getTime() - new Date(b.fechaYHora).getTime();
        } else {
          return new Date(b.fechaYHora).getTime() - new Date(a.fechaYHora).getTime();
        }
      });
    }
  }, [reservations, sortOptions]);

  const handleSortOptions = (option: string) => {
    setSortOptions((prevState: any) => {
      return {
        ...prevState,
        [option]: !prevState[option],
      };
    });
  };

  const handleDeleteReservationRequest = (idReservation: number) => {
    fetch(`http://localhost:8000/api/reservas/delete/${idReservation}`, {
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
    <div className="w-full md:w-2/3 lg:w-3/4 mx-auto rounded-lg overflow-x-auto m-4">
      <h2 className="text-2xl font-bold text-center mt-4">Reservas</h2>
      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Usuario
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Instalación
            </th>
            <th
              className="flex px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              onClick={() => handleSortOptions('fecha')}
            >
              Fecha y Hora
              {sortOptions.fecha ? (
                <img src="/src/assets/icons/arrow-up.svg" className="w-4 ml-2" />
              ) : (
                <img src="/src/assets/icons/arrow-down.svg" className="w-4 ml-2" />
              )}
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duración
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Importe
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedReservations &&
            sortedReservations?.map((reservation) => (
              <tr key={reservation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-center">{reservation.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{reservation.idUsuario}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{reservation.idInstalacion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {format(new Date(reservation.fechaYHora), 'HH:mm dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{reservation.duracion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{reservation.importe}</td>
                <td className="flex justify-center px-6 py-4 whitespace-nowrap text-center">
                  <img
                    src="src/assets/icons/delete.svg"
                    alt="Delete icon"
                    className="w-10 h10 cursor-pointer"
                    onClick={() => handleDeleteReservationRequest(reservation.id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

/* TODO
- Paginar??
- Ordenar por algo más que fecha? Yo creo que con fecha es suficiente pero lo que quieras
*/
