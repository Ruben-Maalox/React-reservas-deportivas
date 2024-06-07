import { useEffect, useMemo, useRef, useState } from 'react';
import switchIcon from '/src/assets/icons/switch-white.svg';
import deleteIcon from '/src/assets/icons/delete.svg';
import editIcon from '/src/assets/icons/edit.svg';
// import reservationsJSON from "../json_prueba/reservas.json";
// --> Types
import { EditReservationInfo, Instalacion, Reserva } from '../types/types';
import { useAuthProvider } from '../context/useAuthProvider';
import ReservationsTable from './ReservationsTable';
import { getDayMonthYear } from '../utils/utils';
import { useMediaQuery } from 'react-responsive';

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
  const [ownReservationsFetch, setOwnReservationsFetch] = useState<Reserva[]>();
  const [showAllOwnReservations, setShowAllOwnReservations] = useState<boolean>(false);
  const [filterByDate, setFilterByDate] = useState<Date>();
  const [filterByInstallation, setFilterByInstallation] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Cada vez que pulsamos en el botón de editar y cambiamos sus valores, se ejecuta para mostrar el modal de edición
  useEffect(() => {
    if (editInfo) {
      setDate(editInfo?.date);
      setShowEditReservation(true);
    }
  }, [editInfo]);

  // Métodos para filtrar en las reservas propias

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reservas/userEmail`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOwnReservationsFetch(data.results);
      });
  }, [reservations]);

  const ownReservationsByUser = useMemo(() => {
    if (showAllOwnReservations && ownReservationsFetch) {
      const allOwnReservations = [...ownReservationsFetch].sort((a, b) => b.id - a.id);

      totalReservations.current = allOwnReservations?.length || 0;
      setPagination(1);

      return allOwnReservations;
    }

    totalReservations.current = ownReservationsFetch?.length || 0;
    setPagination(1);

    return ownReservationsFetch
      ?.filter((reservation) => new Date(reservation.fechaYHora).getTime() >= new Date().getTime())
      .sort((a, b) => b.id - a.id);
  }, [ownReservationsFetch, showAllOwnReservations]);

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
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (pagination === 1) return;
      setPagination((prevState) => prevState - 1);
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const deleteReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reservas/delete/${reservationId}`, {
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

  const isMobileDevice = useMediaQuery({ maxWidth: 665 });

  return (
    <>
      <div
        className={`${showEditReservation ? 'w-2/3' : 'w-full lg:w-3/4 mx-auto bg-white rounded-lg p-6 shadow-md overflow-x-auto'}`}
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
            <div
              className={`flex ${isMobileDevice ? 'flex-col' : 'flex-row items-center'} mb-2 mt-0 overflow-auto`}
              ref={scrollRef}
            >
              <button
                onClick={() => setShowAllOwnReservations((prevState) => !prevState)}
                className={`${isMobileDevice ? '' : 'mr-4 mt-0'} flex items-center bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded`}
              >
                <img src={switchIcon} className="w-6 mr-2" />
                {showAllOwnReservations ? 'Futuras' : 'Futuras y antiguas'}
              </button>

              <input
                type="date"
                id="reservation-date"
                min={getDayMonthYear(new Date())}
                onChange={handleDateChange}
                className={`${isMobileDevice ? 'mt-2' : 'mt-0'} block pl-3 pr-5 py-2  border-gray-300 rounded-md shadow-sm bg-gray-100 text-sm`}
              />

              <select
                onChange={handleFilterByInstallation}
                className={`${isMobileDevice ? 'mt-2' : 'ml-4 mt-0'} px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value={0}>Todas las instalaciones</option>
                {installations?.map((instalacion) => (
                  <option key={instalacion.id} value={instalacion.id}>
                    {instalacion.nombre}
                  </option>
                ))}
              </select>

              <p
                className={`${isMobileDevice ? 'mt-2' : 'ml-4 mt-0 mb-0'} px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm text-sm font-bold`}
              >
                Total de reservas: {totalReservations.current}
              </p>
            </div>

            {isMobileDevice ? (
              <div className="flex flex-col items-center bg-slate-50">
                <h2 className="text-2xl font-bold">
                  {showAllOwnReservations ? 'Reservas próximas y antiguas' : 'Reservas próximas'}
                </h2>
                <hr className="w-full border-t-2 border-gray-200 my-2" />

                {ownReservations &&
                  (ownReservations.length === 0 ? (
                    <p>No tienes reservas aún!!</p>
                  ) : (
                    ownReservations.slice(pagination * 10 - 10, pagination * 10).map((reserva, index) => {
                      const { id, idInstalacion, fechaYHora, duracion, importe } = reserva;
                      const nombreInstalacion = installations?.find(
                        (instalacion) => instalacion.id === idInstalacion,
                      )?.nombre;
                      const [date, timeWithZone] = fechaYHora.split('T');
                      const [fullTime, _] = timeWithZone.split('+');
                      const time = fullTime.substring(0, 5);

                      const reservationDateTime = new Date(`${date}T${time}`);
                      const differenceInHours =
                        (reservationDateTime.getTime() -
                          new Date().getTime() +
                          (reservationDateTime.getTimezoneOffset() + 120) * 60 * 1000) /
                        (1000 * 60 * 60);

                      return (
                        <div
                          className="flex flex-col mt-3 mb-3 w-2/3 bg-white shadow-lg rounded-lg overflow-hidden"
                          key={index}
                        >
                          <div className="px-4 py-5 sm:p-6">
                            <p className="font-bold text-xl mb-2">Instalacion: {nombreInstalacion}</p>
                            <p>
                              <span className="font-bold">Fecha:</span> {date}
                            </p>
                            <p>
                              <span className="font-bold">Hora:</span> {time}
                            </p>
                            <p>
                              <span className="font-bold">Duración:</span> {duracion}
                            </p>
                            <p>
                              <span className="font-bold">Importe:</span> {importe}€
                            </p>
                          </div>
                          <div className="px-4 py-4 sm:px-6 flex pl-2 justify-center border-t border-gray-200">
                            {differenceInHours > 12 && (
                              <>
                                <img
                                  src={editIcon}
                                  alt="Edit icon"
                                  className="w-8 cursor-pointer mr-4"
                                  onClick={() =>
                                    setEditInfo({
                                      installationId: idInstalacion,
                                      date: reservationDateTime,
                                      reservationId: id,
                                    })
                                  }
                                />

                                <img
                                  src={deleteIcon}
                                  alt="Delete icon"
                                  className="w-8 cursor-pointer"
                                  onClick={() => deleteReservation(id)}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ))}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="px-3 py-2 text-center font-bold text-gray-700 uppercase tracking-wider bg-gray-200"
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
                        const [fullTime, _] = timeWithZone.split('+');
                        const time = fullTime.substring(0, 5);

                        const reservationDateTime = new Date(`${date}T${time}`);
                        const differenceInHours =
                          (reservationDateTime.getTime() -
                            new Date().getTime() +
                            (reservationDateTime.getTimezoneOffset() + 120) * 60 * 1000) /
                          (1000 * 60 * 60);

                        return (
                          <tr key={index} className="hover:bg-gray-100 h-20">
                            <td className="px-3 py-2 whitespace-nowrap text-center" data-id={idInstalacion}>
                              {nombreInstalacion}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">{date}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">{time}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">{duracion}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">{importe}€</td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              <div className="flex pl-2 justify-center">
                                {differenceInHours > 12 && (
                                  <>
                                    <img
                                      src={editIcon}
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
                                      src={deleteIcon}
                                      alt="Delete icon"
                                      className="w-8 cursor-pointer"
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
