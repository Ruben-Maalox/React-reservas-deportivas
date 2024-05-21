import { useEffect, useState } from 'react';
// import reservationsJSON from "../json_prueba/reservas.json";
// --> Types
import { OwnReserva } from '../types/types';
import { useAuthProvider } from '../context/useAuthProvider';

export default function OwnReservations() {
  const [ownReservations, setOwnReservations] = useState<OwnReserva[]>();
  const { user } = useAuthProvider();

  useEffect(() => {
    fetch('http://localhost:8000/api/reservas/userEmail', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setOwnReservations(data.results);
        }
      });
  }, []);

  const deleteReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/reservas/delete/${reservationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la reserva');
      }

      //Actualizar el estado de las reservas
      setOwnReservations(ownReservations?.filter((reservation) => reservation.id !== reservationId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full md:w-2/3 lg:w-3/4 mx-auto rounded-lg overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Reserva
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Usuario
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instalacion
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
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
            {ownReservations &&
              (ownReservations.length === 0 ? (
                <tr key={1}>
                  <td colSpan={8} className="text-center text-bold">
                    No tienes ninguna reserva aún!
                  </td>
                </tr>
              ) : (
                ownReservations.map((reserva, index) => {
                  const { id, idUsuario, idInstalacion, nombreInstalacion, fechaYHora, duracion, importe } = reserva;
                  const [date, timeWithZone] = fechaYHora.split('T');
                  const [time, _] = timeWithZone.split('+');

                  const reservationDateTime = new Date(`${date}T${time}`);
                  console.log(reservationDateTime);
                  const differenceInHours =
                    (reservationDateTime.getTime() -
                      new Date().getTime() +
                      (reservationDateTime.getTimezoneOffset() + 120) * 60 * 1000) /
                    (1000 * 60 * 60);
                  console.log('asdasd', differenceInHours);

                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{idUsuario}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center" data-id={idInstalacion}>
                        {nombreInstalacion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{duracion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{importe}€</td>
                      <td className="flex flex-row px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex pl-4">
                          {differenceInHours > 12 && (
                            <img
                              src="src/assets/icons/delete.svg"
                              alt="Delete icon"
                              className="w-10 h10 cursor-pointer"
                              onClick={() => deleteReservation(id)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
