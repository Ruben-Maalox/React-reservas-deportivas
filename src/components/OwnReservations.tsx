import { useEffect, useMemo, useRef, useState } from 'react';
// import reservationsJSON from "../json_prueba/reservas.json";
// --> Types
import { EditReservationInfo, Instalacion, Reserva } from '../types/types';
import { useAuthProvider } from '../context/useAuthProvider';
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
  const [showAllReservations, setShowAllReservations] = useState<boolean>(false);
  const [showEditReservation, setShowEditReservation] = useState<boolean>(false);
  const totalReservations = useRef<number>(0);
  const [pagination, setPagination] = useState<number>(1);

  // Cada vez que pulsamos en el botón de editar y cambiamos sus valores, se ejecuta para mostrar el modal de edición
  useEffect(() => {
    if (editInfo) {
      setDate(editInfo?.date);
      setShowEditReservation(true);
    }
  }, [editInfo]);

  const ownReservations = useMemo(() => {
    if (showAllReservations) {
      const allReservations = reservations
        ?.filter((reservation) => reservation.idUsuario === user?.id)
        .sort((a, b) => b.id - a.id);

      totalReservations.current = allReservations?.length || 0;
      setPagination(1);

      return allReservations;
    }

    totalReservations.current = reservations?.length || 0;
    setPagination(1);

    return reservations
      ?.filter((reservation) => new Date(reservation.fechaYHora).getTime() >= new Date().getTime())
      .sort((a, b) => b.id - a.id);
  }, [reservations, showAllReservations]);

  const filteredInstallation = useMemo(() => {
    return installations?.filter((instalacion) => instalacion.id === editInfo?.installationId);
  }, [installations, editInfo]);

  const reservationsByInstallation = useMemo(() => {
    if (editInfo) {
      return reservations?.filter((reservation) => reservation.idInstalacion === editInfo?.installationId);
    }
  }, [reservations, editInfo]);

  const handlePagination = (next: boolean) => {
    if (next) {
      if (totalReservations.current <= pagination * 10) return;
      setPagination((prevState) => prevState + 1);
    } else {
      if (pagination === 1) return;
      setPagination((prevState) => prevState - 1);
    }
  };

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
          <>
            <div className="mb-2">
              <button
                onClick={() => setShowAllReservations((prevState) => !prevState)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {showAllReservations ? 'Mostrar actuales' : 'Mostrar todas'}
              </button>
            </div>

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
                    ownReservations.slice(pagination * 10 - 10, pagination * 10).map((reserva, index) => {
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

            <div className="flex justify-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
                onClick={() => handlePagination(false)}
              >
                Previous
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handlePagination(true)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
