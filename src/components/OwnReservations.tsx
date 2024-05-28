import { useEffect, useMemo, useState } from 'react';
// import reservationsJSON from "../json_prueba/reservas.json";
// --> Types
import { EditReservationInfo, Instalacion, Reserva } from '../types/types';
import { useAuthProvider } from '../context/useAuthProvider';
import ReservationsErrors from './errors/ReservationsError';
import ReservationsTable from './ReservationsTable';

export interface OwnReservationsProps {
  handleRefetch: () => void;
  error: string | null;
  setError: (error: string) => void;
  installations: Instalacion[];
  reservations: Reserva[];
}

export default function OwnReservations({
  handleRefetch,
  error,
  setError,
  installations,
  reservations,
}: OwnReservationsProps) {
  const { user } = useAuthProvider();
  const [editInfo, setEditInfo] = useState<EditReservationInfo | null>(null);
  const [date, setDate] = useState<Date>();
  const [showEditReservation, setShowEditReservation] = useState<boolean>(false);

  // Cada vez que pulsamos en el botón de editar y cambiamos sus valores, se ejecuta para mostrar el modal de edición
  useEffect(() => {
    if (editInfo) {
      setDate(editInfo?.date);
      setShowEditReservation(true);
    }
  }, [editInfo]);

  const ownReservations = useMemo(() => {
    return reservations?.filter((reservation) => reservation.idUsuario === user?.id).sort((a, b) => b.id - a.id);
  }, [reservations]);

  const filteredInstallation = useMemo(() => {
    return installations?.filter((instalacion) => instalacion.id === editInfo?.installationId);
  }, [installations, editInfo]);

  const reservationsByInstallation = useMemo(() => {
    if (editInfo) {
      return reservations?.filter((reservation) => reservation.idInstalacion === editInfo?.installationId);
    }
  }, [reservations, editInfo]);

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

      handleRefetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowEditReservation = () => {
    setShowEditReservation(false);
  };

  return (
    <>
      <div
        className={`${showEditReservation ? '' : 'w-full md:w-2/3 lg:w-3/4 mx-auto bg-white rounded-lg p-6 shadow-md overflow-x-auto'}`}
      >
        {error && <ReservationsErrors />}

        {showEditReservation && reservationsByInstallation && date ? (
          <ReservationsTable
            handleRefetch={handleRefetch}
            reservations={reservationsByInstallation}
            installations={filteredInstallation}
            error={error}
            setError={setError}
            date={date}
            handleShowEditReservation={handleShowEditReservation}
            editInfo={editInfo}
          />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
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
              {ownReservations &&
                (ownReservations.length === 0 ? (
                  <tr key={1}>
                    <td colSpan={8} className="text-center text-bold">
                      No tienes ninguna reserva aún!
                    </td>
                  </tr>
                ) : (
                  ownReservations.map((reserva, index) => {
                    const { id, idUsuario, idInstalacion, fechaYHora, duracion, importe } = reserva;
                    const nombreInstalacion = installations?.find(
                      (instalacion) => instalacion.id === idInstalacion,
                    )?.nombre;
                    const [date, timeWithZone] = fechaYHora.split('T');
                    const [time, _] = timeWithZone.split('+');

                    const reservationDateTime = new Date(`${date}T${time}`);
                    const differenceInHours =
                      (reservationDateTime.getTime() -
                        new Date().getTime() +
                        (reservationDateTime.getTimezoneOffset() + 120) * 60 * 1000) /
                      (1000 * 60 * 60);

                    return (
                      <tr key={index} className="hover:bg-gray-100">
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
                          <div className="flex pl-4 justify-center">
                            {differenceInHours > 12 && (
                              <>
                                <img
                                  src="src/assets/icons/edit.svg"
                                  alt="Edit icon"
                                  className="w-8 cursor-pointer"
                                  onClick={() =>
                                    setEditInfo({
                                      installationId: idInstalacion,
                                      date: reservationDateTime,
                                      reservationId: id,
                                    })
                                  }
                                />

                                <img
                                  src="src/assets/icons/delete.svg"
                                  alt="Delete icon"
                                  className="w-10 cursor-pointer"
                                  onClick={() => deleteReservation(id)}
                                />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
