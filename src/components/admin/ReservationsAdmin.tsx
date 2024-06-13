import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuthProvider } from '../../context/useAuthProvider';
import { Instalacion, Reserva } from '../../types/types';
import { getDayMonthYear } from '../../utils/utils';
import { useMediaQuery } from 'react-responsive';
import useError from '../../hooks/useError';
import AdminError from '../errors/AdminError';
import switchIcon from '/src/assets/icons/switch-white.svg';

export default function ReservationsAdmin() {
  const { user } = useAuthProvider();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [reservations, setReservations] = useState<Reserva[]>();
  const [installations, setInstallations] = useState<Instalacion[]>();
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  const totalReservations = useRef<number>(0);
  const [pagination, setPagination] = useState<number>(1);
  const [showAllReservations, setShowAllReservations] = useState<boolean>(false);
  const [filterByDate, setFilterByDate] = useState<Date>();
  const [filterByInstallation, setFilterByInstallation] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { error, setError } = useError(2000);

  const isMobileDevice = useMediaQuery({ maxWidth: 790 });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reservas/all`, {
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
        if (data.error) {
          setError(data.error);
        }
      });

    fetch(`${import.meta.env.VITE_API_URL}/instalaciones/all`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setInstallations(data.results);
        }
        if (data.error) {
          setError(data.error);
        }
      });
  }, [refetch]);

  const sortedReservations = useMemo(() => {
    if (showAllReservations && reservations) {
      const allOwnReservations = [...reservations].sort((a, b) => b.id - a.id);

      totalReservations.current = allOwnReservations?.length || 0;
      setPagination(1);

      return allOwnReservations;
    }

    totalReservations.current = reservations?.length || 0;
    setPagination(1);

    return reservations
      ?.filter((reservation) => new Date(reservation.fechaYHora).getTime() >= new Date().getTime())
      .sort((a, b) => b.id - a.id);
  }, [reservations, showAllReservations]);

  const reservationsByDate = useMemo(() => {
    if (filterByDate !== undefined) {
      const filteredByDate = sortedReservations?.filter(
        (reservation) => getDayMonthYear(new Date(reservation.fechaYHora)) === getDayMonthYear(filterByDate),
      );

      totalReservations.current = filteredByDate?.length || 0;
      setPagination(1);

      return filteredByDate;
    }

    totalReservations.current = sortedReservations?.length || 0;

    return sortedReservations;
  }, [sortedReservations, filterByDate]);

  const reservationsByInstallation = useMemo(() => {
    if (filterByInstallation !== 0) {
      const filteredByInstallation = reservationsByDate?.filter(
        (reservation) => reservation.idInstalacion === filterByInstallation,
      );

      totalReservations.current = filteredByInstallation?.length || 0;
      setPagination(1);

      return filteredByInstallation;
    }

    totalReservations.current = reservationsByDate?.length || 0;

    return reservationsByDate;
  }, [reservationsByDate, filterByInstallation]);

  const finalReservations = useMemo(() => {
    return reservationsByInstallation;
  }, [reservationsByInstallation]);

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

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    if (newDate === '') return setFilterByDate(undefined);

    setFilterByDate(new Date(newDate));
  };

  const handleFilterByInstallation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterByInstallation(Number(event.target.value));
  };

  const handleDeleteReservationRequest = (idReservation: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/reservas/delete/${idReservation}`, {
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
          setNotificationMessage(data.ok);
          setTimeout(() => {
            setNotificationMessage('');
          }, 3000);
        }
        if (data.error) {
          setNotificationMessage(data.error);
          setTimeout(() => {
            setNotificationMessage('');
          }, 3000);
        }
      });
  };

  const isPastReservation = (fechaYHora: string) => {
    const today = new Date();
    const reservationDate = new Date(fechaYHora);

    return today.getTime() < reservationDate.getTime();
  };

  return (
    <div className="w-full lg:w-3/4 mx-auto rounded-lg overflow-x-auto m-4">
      {error && <AdminError error={error} />}

      <div
        className={`flex ${isMobileDevice ? 'flex-col' : 'flex-row items-center'} mb-2 mt-0 overflow-auto`}
        ref={scrollRef}
      >
        <button
          onClick={() => setShowAllReservations((prevState) => !prevState)}
          className={`${isMobileDevice ? '' : 'mr-4 mt-0'} flex items-center bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded`}
        >
          <img src={switchIcon} className="w-6 mr-2" />
          {showAllReservations ? 'Futuras' : 'Futuras y antiguas'}
        </button>

        <input
          type="date"
          id="reservation-date"
          min={getDayMonthYear(new Date())}
          value={getDayMonthYear(filterByDate || new Date())}
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
            {showAllReservations ? 'Reservas próximas y antiguas' : 'Reservas próximas'}
          </h2>
          <hr className="w-full border-t-2 border-gray-200 my-2" />

          {finalReservations &&
            (finalReservations.length === 0 ? (
              <p>No tienes reservas aún!!</p>
            ) : (
              finalReservations.slice(pagination * 10 - 10, pagination * 10).map((reserva, index) => {
                const { id, idInstalacion, fechaYHora, duracion, importe } = reserva;
                const nombreInstalacion = installations?.find(
                  (instalacion) => instalacion.id === idInstalacion,
                )?.nombre;
                const [date, timeWithZone] = fechaYHora.split('T');
                const [fullTime, _] = timeWithZone.split('+');
                const time = fullTime.substring(0, 5);

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
                      {isPastReservation(fechaYHora) && (
                        <>
                          <img
                            src="src/assets/icons/delete.svg"
                            alt="Delete icon"
                            className="w-8 cursor-pointer"
                            onClick={() => handleDeleteReservationRequest(id)}
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
        <>
          <h2 className="text-2xl font-bold text-center mt-4">
            {showAllReservations ? 'Reservas próximas y antiguas' : 'Reservas próximas'}
          </h2>

          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Usuario
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instalación
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
              {finalReservations &&
                finalReservations.slice(pagination * 10 - 10, pagination * 10)?.map((reservation) => {
                  const [date, timeWithZone] = reservation.fechaYHora.split('T');
                  const [fullTime, _] = timeWithZone.split('+');
                  const time = fullTime.substring(0, 5);

                  const nombreInstalacion = installations?.find(
                    (instalacion) => instalacion.id === reservation.idInstalacion,
                  )?.nombre;

                  return (
                    <tr key={reservation.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-center">{reservation.idUsuario}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">{nombreInstalacion}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">{date}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">{time}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">{reservation.duracion}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">{reservation.importe}</td>
                      <td className="flex justify-center px-6 py-4 whitespace-nowrap text-center">
                        {isPastReservation(reservation.fechaYHora) && (
                          <>
                            <img
                              src="src/assets/icons/delete.svg"
                              alt="Delete icon"
                              className="w-8 cursor-pointer"
                              onClick={() => handleDeleteReservationRequest(reservation.id)}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      )}

      <div className="flex flex-col justify-start items-center">
        {notificationMessage && (
          <div
            className="m-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg w-auto sm:w-1/2 md:w-1/3 lg:w-1/6"
            role="alert"
          >
            <span className="font-bold inline mb-2 sm:inline">{notificationMessage}</span>
          </div>
        )}
      </div>

      <div className="relative flex justify-center mt-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded mr-2"
          onClick={() => handlePagination(false)}
        >
          &lt;
        </button>

        <span className="flex items-center mx-4 text-center text-sm font-bold bg-gray-400 text-white py-1 px-2 rounded">
          {pagination}
        </span>
        <button
          className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded ml-2"
          onClick={() => handlePagination(true)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

/* TODO
- Paginar??
- Ordenar por algo más que fecha? Yo creo que con fecha es suficiente pero lo que quieras
*/
