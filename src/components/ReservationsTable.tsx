import React, { useState, useRef } from 'react';
import { ReservaModal, MergeRows, ReservationsTableProps } from '../types/types';
import { ReservationModal } from './ReservationModal';
import ReservationsErrors from './errors/ReservationsError';
import { getDayMonthYear } from '../utils/utils';
import { useMediaQuery } from 'react-responsive';

export default function ReservationsTable({
  handleRefetch,
  reservations,
  installations,
  error,
  setError,
  date,
  handleShowEditReservation = undefined,
  editInfo = undefined,
}: ReservationsTableProps) {
  const [selectedDate, setSelectedDate] = useState(date);
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

  // Para renderizar la tabla de una forma u otra en función de si es >1024px
  const isLargeScreen = useMediaQuery({ minWidth: 1090 });
  const isMediumScreen = useMediaQuery({ minWidth: 768, maxWidth: 1089 });

  const handleTableResponsive = {
    small: [
      { start: 0, end: 3 },
      { start: 3, end: 6 },
      { start: 6, end: 9 },
    ],
    medium: [
      { start: 0, end: 4 },
      { start: 4, end: 9 },
    ],
    large: [{ start: 0, end: 9 }],
  };

  const typeOfDevice = () => {
    if (isLargeScreen) return 'large';
    if (isMediumScreen) return 'medium';
    return 'small';
  };

  const handlePrevDay = () => {
    //No permitir seleccionar fechas anteriores a la actual
    if (new Date().getTime() > selectedDate.getTime()) {
      return;
    }
    setSelectedDate((prevDate) => new Date(new Date(prevDate).setDate(prevDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => new Date(new Date(prevDate).setDate(prevDate.getDate() + 1)));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };

  function hasReserva(idInstalacion: number, fechaYHoraNueva: string) {
    return reservations?.find((reserva) => {
      const reservaDate = new Date(reserva.fechaYHora).getTime();
      const targetDate = new Date(fechaYHoraNueva).getTime();

      return reserva.idInstalacion === idInstalacion && reservaDate === targetDate;
    });
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
    // En caso de que vengamos de editar una reserva, tendríamos que filtrarla para que no de problemas y se pueda modificar su hora
    let reservationsToCheck = reservations;

    if (reservations && editInfo) {
      const editingReservation = hasReserva(editInfo.installationId, editInfo.date.toString());
      reservationsToCheck = reservations.filter((r) => r.id !== editingReservation?.id);
    }

    const fechaInicioComprobacion = new Date(fechaYHoraNueva);
    fechaInicioComprobacion.setHours(fechaInicioComprobacion.getHours() - 1);
    const fechaFinalComprobacion = new Date(fechaYHoraNueva);
    fechaFinalComprobacion.setTime(fechaFinalComprobacion.getTime() + 90 * 60 * 1000);

    const reservationsAlreadyExisting = reservationsToCheck?.filter(
      (reserva) =>
        reserva.idInstalacion === idInstalacion &&
        new Date(reserva.fechaYHora) >= fechaInicioComprobacion &&
        new Date(reserva.fechaYHora) < fechaFinalComprobacion,
    );

    let duracionNueva = 0;
    if (reservationsAlreadyExisting && reservationsAlreadyExisting.length > 0) {
      // Primero ordenamos para que esté el de menor hora antes y después los de mayor hora (porque los de menor hora en caso de pasar devuelven 90min, los de mayor hora son los restrictivos)
      reservationsAlreadyExisting.sort((a, b) => {
        return new Date(a.fechaYHora).getTime() - new Date(b.fechaYHora).getTime();
      });

      reservationsAlreadyExisting?.some((reservation) => {
        duracionNueva = 0;
        const fechaInicioNueva = new Date(fechaYHoraNueva);
        const fechaFinalNueva60 = new Date(fechaYHoraNueva);
        fechaFinalNueva60.setTime(fechaInicioNueva.getTime() + 60 * 60 * 1000);
        const fechaFinalNueva90 = new Date(fechaYHoraNueva);
        fechaFinalNueva90.setTime(fechaInicioNueva.getTime() + 90 * 60 * 1000);

        const fechaInicioExistente = new Date(reservation.fechaYHora);
        const fechaFinalExistente = new Date(fechaInicioExistente.getTime());
        fechaFinalExistente.setTime(fechaInicioExistente.getTime() + reservation.duracion * 60 * 1000);

        if (fechaInicioExistente.getTime() === fechaInicioNueva.getTime()) {
          return true;
        }

        if (
          fechaInicioExistente.getTime() < fechaInicioNueva.getTime() &&
          fechaFinalExistente.getTime() > fechaInicioNueva.getTime()
        ) {
          return true;
        }

        if (
          fechaInicioExistente.getTime() > fechaInicioNueva.getTime() &&
          fechaFinalNueva90.getTime() > fechaInicioExistente.getTime()
        ) {
          if (fechaFinalNueva60.getTime() > fechaInicioExistente.getTime()) {
            return true;
          }

          duracionNueva = 60;
          return false;
        }

        if (fechaInicioNueva.getHours() === 22) {
          duracionNueva = 60;
        } else {
          duracionNueva = 90;
        }
      });
    } else {
      if (new Date(fechaYHoraNueva).getHours() === 22) {
        duracionNueva = 60;
      } else {
        duracionNueva = 90;
      }
    }

    return duracionNueva;
  }

  const handleReservation = (idInstalacion: number, fechaYHoraNueva: string) => {
    if (!isAfterCurrentTime(fechaYHoraNueva)) {
      return;
    }

    if (isAfterCloseTime(fechaYHoraNueva)) {
      setError('No puedes realizar una reserva a partir de las 22:30');
      return;
    }

    const nuevaDuracion = checkIfReservationAlreadyExists(idInstalacion, fechaYHoraNueva);
    if (nuevaDuracion === 0) {
      setError('No puedes hacer esta reserva!');
      return;
    }

    let duracionesPosibles = [];
    if (nuevaDuracion === 90) {
      duracionesPosibles = [60, 90];
    } else {
      duracionesPosibles = [60];
    }

    const instalacion = installations?.find((instalacion) => instalacion.id === idInstalacion)!;
    const precioHora = instalacion.precioHora;
    const nombreInstalacion = instalacion.nombre;
    const reservationEditId = editInfo && editInfo.reservationId;
    const isEdit = editInfo ? true : false;

    const reserva: ReservaModal = {
      idInstalacion: idInstalacion,
      nombreInstalacion: nombreInstalacion,
      fechaYHora: fechaYHoraNueva,
      precioHora: precioHora,
      duraciones: duracionesPosibles,
      isEdit: isEdit,
      reservationId: reservationEditId,
    };

    setReservationData(reserva);
    setShowModalReservation(true);
  };

  function handleCloseModal() {
    setShowModalReservation(false);
  }

  function isAfterCurrentTime(fechaYHoraNueva: string): boolean {
    const currentDate = new Date();
    const targetDate = new Date(fechaYHoraNueva);

    // Verificar si la fecha objetivo es anterior a la fecha actual
    if (
      targetDate.getFullYear() < currentDate.getFullYear() ||
      (targetDate.getFullYear() === currentDate.getFullYear() && targetDate.getMonth() < currentDate.getMonth()) ||
      (targetDate.getFullYear() === currentDate.getFullYear() &&
        targetDate.getMonth() === currentDate.getMonth() &&
        targetDate.getDate() < currentDate.getDate())
    ) {
      return false;
    }

    // Verificar si es el mismo día pero una hora anterior
    if (
      targetDate.getFullYear() === currentDate.getFullYear() &&
      targetDate.getMonth() === currentDate.getMonth() &&
      targetDate.getDate() === currentDate.getDate() &&
      targetDate.getTime() <= currentDate.getTime()
    ) {
      return false;
    }

    return true;
  }

  function isAfterCloseTime(fechaYHoraNueva: string): boolean {
    const targetDate = new Date(fechaYHoraNueva);
    const closeTime = new Date(fechaYHoraNueva);
    closeTime.setHours(22, 30, 0, 0);

    return targetDate.getTime() >= closeTime.getTime();
  }

  return (
    <>
      {installations && (
        <div
          className={`w-full relative ${installations.length === 1 ? 'w-1/6' : 'md:w-2/3 lg:w-3/4'} mx-auto bg-white rounded-lg p-6 shadow-md`}
        >
          {error && <ReservationsErrors error={error} />}
          {installations.length === 1 && (
            <button
              onClick={() => handleShowEditReservation && handleShowEditReservation()}
              className="absolute right-2 top-2 text-lg font-bold bg-red-500 hover:bg-red-700 text-white rounded-full h-10 w-10 flex items-center justify-center"
            >
              &times;
            </button>
          )}

          <h1 className="font-bold text-center text-3xl mb-6 text-gray-800">Reservas</h1>

          {(installations.length === 1 ? handleTableResponsive['large'] : handleTableResponsive[typeOfDevice()]).map(
            (range, index) => {
              return (
                <React.Fragment key={index}>
                  <div
                    className={`flex flex-col sm:flex-row bg-gray-100 items-center p-4 rounded-md mb-4 
                ${index >= 1 ? 'mt-4' : ''}`}
                  >
                    <label htmlFor="reservation-date" className="block text-sm font-medium text-gray-700 mr-4">
                      Fecha:
                    </label>
                    <input
                      type="date"
                      id="reservation-date"
                      value={getDayMonthYear(selectedDate)}
                      min={getDayMonthYear(new Date())}
                      onChange={handleDateChange}
                      className="mt-1 block pl-3 pr-5 py-2 sm:text-sm border-gray-300 rounded-md shadow-sm"
                    />
                    <div className="flex mt-2 sm:mt-0 ml-4 space-x-2">
                      <button
                        onClick={handlePrevDay}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                      >
                        &lt;
                      </button>
                      <button
                        onClick={handleNextDay}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                      >
                        &gt;
                      </button>
                    </div>
                    <label className="ml-4 text-md text-gray-600 ">
                      <span className="font-medium">Hora actual:</span> {String(new Date().getHours()).padStart(2, '0')}
                      :{String(new Date().getMinutes()).padStart(2, '0')}
                    </label>
                  </div>

                  <div className="rounded-md">
                    <table className="min-w-full text-center border-collapse">
                      <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr>
                          {installations.slice(range.start, range.end).map((instalacion) => (
                            <th key={instalacion.id} data-id={instalacion.id} className="p-4 border bg-gray-200">
                              {instalacion.nombre}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 28 }, (_, i) => i + 18).map((halfHour) => {
                          const hour1 = Math.floor(halfHour / 2) % 24;
                          const hour2 = hour1 >= 10 ? hour1 : `0${hour1}`;
                          const time = `${hour2}:${halfHour % 2 === 0 ? '00' : '30'}`;

                          return (
                            <tr key={halfHour} data-hour={time} className="odd:bg-white even:bg-gray-50">
                              {installations.slice(range.start, range.end).map((instalacion) => {
                                const fechaYHoraNueva = getDayMonthYear(selectedDate) + 'T' + time;
                                const reserva = hasReserva(instalacion.id, fechaYHoraNueva);

                                // Para ver si la reserva que se va a pintar es la de editar o una ya existente
                                let editReservation = false;
                                if (reserva && editInfo && editInfo.installationId === instalacion.id) {
                                  const reservationEditDate = new Date(editInfo.date);
                                  const currentReservationDate = new Date(reserva.fechaYHora);

                                  if (reservationEditDate.getTime() === currentReservationDate.getTime()) {
                                    editReservation = true;
                                  }
                                }

                                const cRow = mergeRows.current[instalacion.id];

                                const shouldShowGray = isAfterCurrentTime(fechaYHoraNueva);

                                if (reserva && reserva.duracion === 60 && editReservation === false) {
                                  cRow.merge = 2;
                                  cRow.first = true;
                                }
                                if (reserva && reserva.duracion === 90 && editReservation === false) {
                                  cRow.merge = 3;
                                  cRow.first = true;
                                }

                                if (cRow.first === false) {
                                  cRow.merge -= 1;
                                  if (cRow.merge === 1) cRow.first = true;
                                  return null;
                                }

                                if (cRow.merge > 1) {
                                  cRow.first = false;
                                }
                                if (cRow.merge === 1) {
                                  cRow.first = true;
                                }

                                return (
                                  <td
                                    onClick={() => handleReservation(instalacion.id, fechaYHoraNueva)}
                                    rowSpan={cRow.merge}
                                    key={instalacion.id}
                                    data-instalacion={instalacion.id}
                                    className={`border 
                                      ${!shouldShowGray ? 'bg-gray-300' : reserva ? (editReservation ? 'bg-blue-500' : 'bg-red-500 text-white') : ''} 
                                      ${installations.length === 1 ? 'w-5/6' : 'w-1/6'} 
                                      py-2 cursor-pointer
                                      `}
                                  >
                                    {showHour(cRow.merge, time)}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <p className="mt-4 text-sm text-gray-800 font-bold">
                      *Informamos que para cualquier cambio o anulación de reserva debe comunicarse con 12h de
                      antelación. De lo contrario no se devolverá el importe.*
                    </p>
                  </div>
                </React.Fragment>
              );
            },
          )}
        </div>
      )}

      {showModalReservation && reservationData && (
        <ReservationModal
          reservationData={reservationData}
          handleCloseModal={handleCloseModal}
          handleRefetch={handleRefetch}
          handleShowEditReservation={handleShowEditReservation}
        />
      )}
    </>
  );
}

/* TODO:
- Quitar el inicio del state de la fecha (he puesto siempre 24-04-2024T10:30+02:00 para no teneer que ir pasando fechas)
- Ahora mismo he fijado como hora las 10.30 para comprobar que no se pincha en horas anteriores a la actual
- Hay que tener en cuenta la franja horaria (ahora mismo es +02:00)
*/
