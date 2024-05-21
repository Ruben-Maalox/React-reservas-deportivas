import { useState, useEffect, useRef } from 'react';
import instalacionesAPI from '../json_prueba/instalaciones.json';
import reservasJSON from '../json_prueba/reservas.json';
import { Reserva, ReservaModal, Instalacion } from '../types/types';
import { Modal } from './ReservationModal';
import ReservationsErrors from './errors/ReservationsError';
import useError from '../hooks/useError';
import { useAuthProvider } from '../context/useAuthProvider';

export interface MergeRows {
  [key: number]: {
    merge: number;
    first: boolean;
  };
}

export default function ReservationsTable() {
  const [installations, setInstallations] = useState<Instalacion[]>([]); // <-- [hour, pista
  const [reservas, setReservas] = useState<Reserva[] | null>(null); // <-- [hour, pista
  const [selectedDate, setSelectedDate] = useState(new Date()); // Para que empiece siempre en 2024-04-24
  const mergeRows = useRef<MergeRows>({
    1: { merge: 1, first: true },
    2: { merge: 1, first: true },
    3: { merge: 1, first: true },
    4: { merge: 1, first: true },
    5: { merge: 1, first: true },
    6: { merge: 1, first: true },
    7: { merge: 1, first: true },
    8: { merge: 1, first: true },
  });
  const [showModalReservation, setShowModalReservation] = useState<boolean>(false);
  const [reservationData, setReservationData] = useState<ReservaModal | null>(null);
  const { showError, setShowError } = useError(3000);
  const { user } = useAuthProvider();

  useEffect(() => {
    fetch('http://localhost:8000/api/instalaciones/all', {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setInstallations(data.results);
        }
      });

    fetch('http://localhost:8000/api/reservas/all', {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        debugger;
        if (data.ok) {
          setReservas(data.results);
        }
      });
  }, [user]);

  const handlePrevDay = () => {
    setSelectedDate((prevDate) => new Date(new Date(prevDate).setDate(prevDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => new Date(new Date(prevDate).setDate(prevDate.getDate() + 1)));
  };

  const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };

  function hasReserva(idInstalacion: number, fechaYHoraNueva: string) {
    return reservas?.find(
      (reserva) => reserva.idInstalacion === idInstalacion && reserva.fechaYHora === fechaYHoraNueva,
      /* 
      const reservaDate = new Date(reserva.fechaYHora).getTime();
      const targetDate = new Date(fechaYHoraNueva).getTime();
      return reserva.idInstalacion === idInstalacion && reservaDate === targetDate;
      */
    );
  }

  function showHour(merge: number, hour: string) {
    if (merge === 1) {
      return hour;
    }

    const [hourPart, minutePart] = hour.split(':');
    let endHour = parseInt(hourPart);
    let endMinute = parseInt(minutePart);

    // Add 30 minutes for each merge
    for (let i = 0; i < merge; i++) {
      endMinute += 30;
      if (endMinute >= 60) {
        endHour += 1;
        endMinute = 0;
      }
    }

    // Format the end hour and minute
    const endHourStr = endHour < 10 ? `0${endHour}` : `${endHour}`;
    const endMinuteStr = endMinute === 0 ? '00' : `${endMinute}`;

    return `${hour} - ${endHourStr}:${endMinuteStr}`;
  }

  function checkIfReservationAlreadyExists(idInstalacion: number, fechaYHoraNueva: string) {
    // fechaInicioComprobacion (1h antes) y fechaFinalComprobacion (1h 30 min después) de la hora de inicio de la nueva reserva
    const fechaInicioComprobacion = new Date(fechaYHoraNueva);
    fechaInicioComprobacion.setHours(fechaInicioComprobacion.getHours() - 1);
    const fechaFinalComprobacion = new Date(fechaYHoraNueva);
    fechaFinalComprobacion.setTime(fechaFinalComprobacion.getTime() + 90 * 60 * 1000); // Add 90 minutes

    // Con este método filtramos solo las reservas para ese día y esa instalación en un intervalo de 1h antes del inicio de la nueva y 1h 30 min después
    const reservationsAlreadyExisting = reservas?.filter(
      (reserva) =>
        reserva.idInstalacion === idInstalacion &&
        new Date(reserva.fechaYHora) >= fechaInicioComprobacion &&
        new Date(reserva.fechaYHora) < fechaFinalComprobacion,
    );

    let duracionNueva = 0;
    // Si hay reservas ya existentes, comprobamos si la nueva reserva podría ser válida
    if (reservationsAlreadyExisting && reservationsAlreadyExisting.length > 0) {
      // Con el método some devolvería true en la primera coincidencia (y por tanto duracion sería 0 cuando no sea posible, 60 cuando se pueda 60min y 90 cuando se pueda 90 min)
      reservationsAlreadyExisting?.some((reservation) => {
        duracionNueva = 0; // Reinicio la duración a 0 para cada reservaExistente
        // Para fecha inicio no hay problema, para la fechaFinal hay que comprobar si sería posible duración de 60 o 90 min
        const fechaInicioNueva = new Date(fechaYHoraNueva);
        const fechaFinalNueva60 = new Date(fechaYHoraNueva);
        fechaFinalNueva60.setTime(fechaInicioNueva.getTime() + 60 * 60 * 1000); // Add 60 minutes
        const fechaFinalNueva90 = new Date(fechaYHoraNueva);
        fechaFinalNueva90.setTime(fechaInicioNueva.getTime() + 90 * 60 * 1000); // Add 90 minutes

        const fechaInicioExistente = new Date(reservation.fechaYHora);
        // Ahora calculamos la hora de fin de la reserva existente (es la inicial + la duración de la reserva en horas y minutos)
        const fechaFinalExistente = new Date(fechaInicioExistente.getTime()); // Creamos una copia exacta y luego le sumamos las horas y minutos (aqui usamos getTime porque es el objeto Date en el caso de arriba es un string lo que se le estaba)
        fechaFinalExistente.setTime(fechaInicioExistente.getTime() + reservation.duracion * 60 * 1000); // Add the duration in milliseconds

        if (fechaInicioExistente.getTime() === fechaInicioNueva.getTime()) return true;
        if (
          fechaInicioExistente.getTime() < fechaInicioNueva.getTime() &&
          fechaFinalExistente.getTime() > fechaInicioNueva.getTime()
        )
          return true;
        // Hasta aquí bien, como en la BD (ahora nos falta saber si podría ser válido para 60min o para 90min)
        if (
          fechaInicioExistente.getTime() > fechaInicioNueva.getTime() &&
          fechaFinalNueva90.getTime() > fechaInicioExistente.getTime()
        ) {
          if (fechaFinalNueva60.getTime() > fechaInicioExistente.getTime()) return true; // esto significa que no valdría ni 90 ni 60min
          // Si solo se cumple el primer if, es que podría ser válido para 60min
          duracionNueva = 60;
          return false;
        }

        duracionNueva = 90;
      });
    } else {
      duracionNueva = 90;
    }

    return duracionNueva;
  }

  const handleReservation = (idInstalacion: number, fechaYHoraNueva: string) => {
    // Comprobamos si estamos pinchando en un TD cuya hora es inferior a la hora actual (en ese caso, return para que el click no haga nada)
    if (!isAfterCurrentTime(fechaYHoraNueva)) {
      return;
    }
    // Comprobamos si ya hay una reserva en esa franja horaria
    const nuevaDuracion = checkIfReservationAlreadyExists(idInstalacion, fechaYHoraNueva);
    if (nuevaDuracion === 0) {
      setShowError(true);
      return;
    }
    let duracionesPosibles = [];
    if (nuevaDuracion === 90) {
      duracionesPosibles = [60, 90];
    } else {
      duracionesPosibles = [60];
    }

    // Si todo ha ido bien, abrimos el modal con la información respectiva de la reserva
    const instalacion = installations.find((instalacion) => instalacion.id === idInstalacion)!; // La exclamación es para decirle que instalación nunca va a ser undefined (siempre vamos a encontrar una con ese ID)
    const precioHora = instalacion.precioHora;
    const nombreInstalacion = instalacion.nombre;

    const reserva: ReservaModal = {
      idInstalacion: idInstalacion,
      nombreInstalacion: nombreInstalacion,
      fechaYHora: fechaYHoraNueva,
      precioHora: precioHora,
      duracion: duracionesPosibles,
    };

    setReservationData(reserva);
    setShowModalReservation(true);
  };

  function handleCloseModal() {
    setShowModalReservation(false);
  }

  function isAfterCurrentTime(fechaYHoraNueva: string): boolean {
    const currentDate = new Date(selectedDate.getTime());
    return currentDate.getTime() < new Date(fechaYHoraNueva).getTime();
  }

  return (
    <>
      {installations && (
        <div className="w-full md:w-2/3 lg:w-3/4 mx-auto bg-white rounded-lg p-4 ">
          {showError && <ReservationsErrors />}
          <h1 className="font-bold text-center text-3xl mb-5">Reservas</h1>
          <div className="flex flex-col sm:flex-row bg-gray-200 items-center p-3">
            <label htmlFor="reservation-date" className="block text-sm font-medium text-gray-700 mr-3">
              Fecha:
            </label>
            <input
              type="date"
              id="reservation-date"
              value={formattedDate}
              onChange={handleDateChange}
              className="mt-1 block pl-3 pr-5 sm:text-sm border-gray-300 rounded-md"
            />
            <div className="flex mt-2 sm:mt-0">
              <button
                onClick={handlePrevDay}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 px-3 rounded"
              >
                &lt;
              </button>
              <button
                onClick={handleNextDay}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 px-3 rounded"
              >
                &gt;
              </button>
            </div>
            <p>
              Current hour: {selectedDate.getHours()}:{selectedDate.getMinutes()}
            </p>
          </div>
          <div className="overflow-auto ">
            <table className="min-w-full text-center">
              <thead>
                <tr>
                  {/* <th>Time</th> */}
                  {installations.map((instalacion) => {
                    return (
                      <th key={instalacion.id} data-id={instalacion.id} className="p-4">
                        {instalacion.nombre}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 29 }, (_, i) => i + 18).map((halfHour) => {
                  const hour1 = Math.floor(halfHour / 2) % 24;
                  const hour2 = hour1 >= 10 ? hour1 : `0${hour1}`;
                  const time = `${hour2}:${halfHour % 2 === 0 ? '00' : '30'}`;

                  return (
                    <tr key={halfHour} data-hour={time}>
                      <>
                        {/* <td>{time}</td> */}
                        {installations.map((instalacion) => {
                          const fechaYHoraNueva = formattedDate + 'T' + time + '+02:00';
                          const reserva = hasReserva(instalacion.id, fechaYHoraNueva);
                          const cRow = mergeRows.current[instalacion.id];

                          // Comprobar si la hora de la celda es mayor que la hora actual para mostrar el TD en gris
                          const shouldShowGray = isAfterCurrentTime(fechaYHoraNueva);

                          //--> Fusionar columnas???
                          if (reserva && reserva.duracion === 60) {
                            cRow.merge = 2;
                            cRow.first = true;
                          }
                          if (reserva && reserva.duracion === 90) {
                            cRow.merge = 3;
                            cRow.first = true;
                          }

                          // Si no es la primera vez que se pinta la celda y hay que fusionar:
                          if (cRow.first === false) {
                            cRow.merge -= 1;
                            if (cRow.merge === 1) cRow.first = true;
                            return null; // Devolvemos null para que no pinte un TD
                          }

                          // Si es la primera vez que se pinta la celda devolvemos un TD
                          if (cRow.merge > 1) {
                            cRow.first = false;
                          }
                          if (cRow.merge === 1) {
                            cRow.first = true;
                          }

                          return (
                            <td
                              onClick={() => {
                                handleReservation(instalacion.id, fechaYHoraNueva);
                              }}
                              rowSpan={cRow.merge}
                              key={instalacion.id}
                              data-instalacion={instalacion.id}
                              className={`border ${!shouldShowGray ? 'bg-gray-300' : reserva ? 'bg-red-500' : ''} w-1/6 `}
                            >
                              {showHour(cRow.merge, time)}
                            </td>
                          );
                        })}
                      </>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showModalReservation && reservationData && (
        <Modal reservationData={reservationData} handleCloseModal={handleCloseModal} />
      )}
    </>
  );
}

/* TODO:
- Quitar el inicio del state de la fecha (he puesto siempre 24-04-2024T10:30+02:00 para no teneer que ir pasando fechas)
- Ahora mismo he fijado como hora las 10.30 para comprobar que no se pincha en horas anteriores a la actual
- Hay que tener en cuenta la franja horaria (ahora mismo es +02:00)
*/
