import { useEffect, useMemo, useRef, useState } from 'react';
// import reservationsJSON from "../json_prueba/reservas.json";
// --> Types
import { EditReservationInfo, Instalacion, Reserva } from '../types/types';
import { useAuthProvider } from '../context/useAuthProvider';
import ReservationsTable from './ReservationsTable';
import { getDayMonthYear } from '../utils/utils';

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
  const totalReservations = useRef<number>(0);
  const [pagination, setPagination] = useState<number>(1);
  const [showAllOwnReservations, setShowAllOwnReservations] = useState<boolean>(false);
  const [filterByDate, setFilterByDate] = useState<Date>();
  const [filterByInstallation, setFilterByInstallation] = useState<number>(0);

  // Cada vez que pulsamos en el botón de editar y cambiamos sus valores, se ejecuta para mostrar el modal de edición
  useEffect(() => {
    if (editInfo) {
      setDate(editInfo?.date);
      setShowEditReservation(true);
    }
  }, [editInfo]);

  // Métodos para filtrar en las reservas propias

  const ownReservationsByUser = useMemo(() => {
    if (showAllOwnReservations) {
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
  }, [reservations, showAllOwnReservations]);

  const ownReservationsByDate = useMemo(() => {
    if (filterByDate !== undefined) {
      const filteredByDate = ownReservationsByUser?.filter(
        (reservation) => getDayMonthYear(new Date(reservation.fechaYHora)) === getDayMonthYear(filterByDate),
      );

      totalReservations.current = filteredByDate?.length || 0;
      setPagination(1);

      return filteredByDate;
    }

    totalReservations.current = ownReservationsByUser?.length || 0;

    return ownReservationsByUser;
  }, [ownReservationsByUser, filterByDate]);

  const ownReservationsByInstallation = useMemo(() => {
    if (filterByInstallation !== 0) {
      const filteredByInstallation = ownReservationsByDate?.filter(
        (reservation) => reservation.idInstalacion === filterByInstallation,
      );

      totalReservations.current = filteredByInstallation?.length || 0;
      setPagination(1);

      return filteredByInstallation;
    }

    totalReservations.current = ownReservationsByDate?.length || 0;

    return ownReservationsByDate;
  }, [ownReservationsByDate, filterByInstallation]);

  const ownReservations = useMemo(() => {
    return ownReservationsByInstallation;
  }, [ownReservationsByInstallation]);

  // Métodos para filtrar en las reservas que se van a mostrar al pinchar en EDITAR en la tabla

  const filteredInstallation = useMemo(() => {
    return installations?.filter((instalacion) => instalacion.id === editInfo?.installationId);
  }, [installations, editInfo]);

  const reservationsByInstallation = useMemo(() => {
    if (editInfo) {
      return reservations?.filter((reservation) => reservation.idInstalacion === editInfo?.installationId);
    }
  }, [reservations, editInfo]);

  // Métodos para manejar eventos

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

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    if (newDate === '') return setFilterByDate(undefined);

    setFilterByDate(new Date(newDate));
  };

  const handleFilterByInstallation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterByInstallation(Number(event.target.value));
  };

  return (
    <>
      <div
        className={`${showEditReservation ? '' : 'w-full lg:w-3/4 mx-auto bg-white rounded-lg p-6 shadow-md overflow-x-auto'}`}
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
            <div className="flex flex-col sm:flex-row mb-2 mt-0 sm:items-center overflow-auto">
              <button
                onClick={() => setShowAllOwnReservations((prevState) => !prevState)}
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded sm:mr-4 sm:mt-0"
              >
                {showAllOwnReservations ? 'Futuras' : 'Futuras y antiguas'}
              </button>

              <input
                type="date"
                id="reservation-date"
                min={getDayMonthYear(new Date())}
                onChange={handleDateChange}
                className="block pl-3 pr-5 py-2  border-gray-300 rounded-md shadow-sm bg-gray-100 mt-2 sm:mt-0 text-sm"
              />

              <select
                onChange={handleFilterByInstallation}
                className="px-4  py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:ml-4 sm:mt-0 mt-2"
              >
                <option value={0}>Todas las instalaciones</option>
                {installations?.map((instalacion) => (
                  <option key={instalacion.id} value={instalacion.id}>
                    {instalacion.nombre}
                  </option>
                ))}
              </select>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="px-3 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider bg-gray-200"
                    colSpan={6}
                  >
                    {showAllOwnReservations ? 'Reservas próximas y antiguas' : 'Reservas próximas'}
                  </th>
                </tr>
                <tr>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instalacion
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importe
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ownReservations &&
                  (ownReservations.length === 0 ? (
                    <tr key={1}>
                      <td colSpan={6} className="text-center text-bold">
                        No tienes ninguna reserva aún!
                      </td>
                    </tr>
                  ) : (
                    ownReservations.slice(pagination * 10 - 10, pagination * 10).map((reserva, index) => {
                      const { id, idInstalacion, fechaYHora, duracion, importe } = reserva;
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
                        <tr key={index} className="hover:bg-gray-100 h-20">
                          <td className="px-3 py-2 whitespace-nowrap text-center text-sm" data-id={idInstalacion}>
                            {nombreInstalacion}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center text-sm">{date}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-center text-sm">{time}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-center text-sm">{duracion}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-center text-sm">{importe}€</td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <div className="flex pl-2 justify-center">
                              {differenceInHours > 12 && (
                                <>
                                  <img
                                    src="src/assets/icons/edit.svg"
                                    alt="Edit icon"
                                    className="w-6 cursor-pointer"
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
                                    className="w-6 cursor-pointer"
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
                <tr>
                  <td colSpan={6} className="px-3 py-2 whitespace-nowrap text-sm">
                    <span className="font-bold">Total de reservas:</span> {totalReservations.current}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="relative flex justify-center mt-4">
              <button
                className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded mr-2"
                onClick={() => handlePagination(false)}
              >
                Previous
              </button>

              <span className="flex items-center mx-4 text-center text-sm font-bold bg-gray-400 text-white py-1 px-2 rounded">
                {pagination}
              </span>
              <button
                className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded ml-2"
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
