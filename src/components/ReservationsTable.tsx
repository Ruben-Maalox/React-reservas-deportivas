import { useState, useEffect, useRef } from "react";
import { INSTALACIONES_INFO } from "../constants/constants";
import reservasJSON from "../json_prueba/reservas.json";
import { Reserva } from "../types/types";
import { Modal } from "./Modal";

// import Register from "../register/Register";
export interface MergeRows {
  [key: number]: {
    merge: number;
    first: boolean;
  };
}

export default function ReservationsTable() {
  const [instalaciones, setInstalaciones] = useState<any[]>([]); // <-- [hour, pista
  const [reservas, setReservas] = useState<Reserva[] | null>(null); // <-- [hour, pista
  const [selectedDate, setSelectedDate] = useState(new Date());
  const mergeRows = useRef<MergeRows>({ 1: { merge: 1, first: true }, 2: { merge: 1, first: true }, 3: { merge: 1, first: true }, 4: { merge: 1, first: true }, 5: { merge: 1, first: true }, 6: { merge: 1, first: true }, 7: { merge: 1, first: true }, 8: { merge: 1, first: true } });
  const [showModalReservation, setShowModalReservation] = useState<boolean>(false);
  const [reservationsData, setReservationsData] = useState(null);
  const [installations, setInstallations] = useState({});

  useEffect(() => {
    /* fetch("http://localhost:8000/api/instalaciones/all")
      .then((response) => response.json())
      .then((data) => setInstalaciones(data.instalaciones)); */
    setInstalaciones(INSTALACIONES_INFO);
    setReservas(reservasJSON);

    const installationsMap = {};
    for (const instalacion of INSTALACIONES_INFO) {
      installationsMap[instalacion.id] = instalacion.nombre;
    }
    setInstallations(installationsMap);
  }, []);

  const handlePrevDay = () => {
    setSelectedDate((prevDate) => new Date(new Date(prevDate).setDate(prevDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => new Date(new Date(prevDate).setDate(prevDate.getDate() + 1)));
  };

  const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };

  function hasReserva(idInstalacion: string, hora: string) {
    return reservas?.find((reserva) => reserva.idInstalacion == idInstalacion && reserva.hora === hora && reserva.fecha === formattedDate);
  }
  
  function showHour(merge: number, hour: string) {
    if (merge === 1) {
      return hour;
    }

    const [hourPart, minutePart] = hour.split(":");
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
    const endMinuteStr = endMinute === 0 ? "00" : `${endMinute}`;

    return `${hour} - ${endHourStr}:${endMinuteStr}`;
  }

  const handleReservation = (instalacion, time)=>{

    const reserva = {
      instalacion,
      fecha: formattedDate,
      hora: time,
      duracion: '60', 
      importe: '100'
    };
  
    setReservationsData(reserva);
    setShowModalReservation(true);
  }

  function handleCloseModal() {
    setShowModalReservation(false);
  }


  return (
    <>
      {instalaciones.length > 0 && (
        <div className="w-full md:w-2/3 lg:w-3/4 mx-auto bg-white rounded-lg p-4">
          <h1 className="font-bold text-center text-3xl mb-5">Reservas</h1>
          <div className="flex flex-col sm:flex-row bg-gray-200 items-center p-3">
            <label htmlFor="reservation-date" className="block text-sm font-medium text-gray-700 mr-3">
              Fecha:
            </label>
            <input type="date" id="reservation-date" value={formattedDate} onChange={handleDateChange} className="mt-1 block pl-3 pr-5 sm:text-sm border-gray-300 rounded-md" />
            <div className="flex mt-2 sm:mt-0">
              <button onClick={handlePrevDay} className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 px-3 rounded">
                &lt;
              </button>
              <button onClick={handleNextDay} className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 px-3 rounded">
                &gt;
              </button>
            </div>
          </div>
          <div className="overflow-auto ">
          <table className="min-w-full text-center">
            <thead>
              <tr>
                {/* <th>Time</th> */}
                {instalaciones.map((instalacion) => {
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
                const time = `${hour2}:${halfHour % 2 === 0 ? "00" : "30"}`;
                
                return (
                  <tr key={halfHour} data-hour={time}>
                    <>
                      {/* <td>{time}</td> */}
                      {instalaciones.map((instalacion) => {
                        const reserva = hasReserva(instalacion.id, time);
                        const cRow = mergeRows.current[instalacion.id];

                        //--> Fusionar columnas???
                        if (reserva && reserva.duracion === "60") {
                          cRow.merge = 2;
                          cRow.first = true;
                        }
                        if (reserva && reserva.duracion === "90") {
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
                         
                            <td onClick={()=>{handleReservation(instalacion.id, time)}} rowSpan={cRow.merge} key={instalacion.id} data-instalacion={instalacion.id} className={`border ${reserva ? "bg-red-500" : ""} w-1/6 `}>
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
      {showModalReservation && reservationsData && (
        <Modal
        reservationsData={reservationsData} 
        installations={installations} 
        handleCloseModal={handleCloseModal} 
        setReservationsData={setReservationsData} 
        />
      )}
    </>
  );
}

/* TODO:
- Ver dónde guardar el token recibido de la API para futuras peticiones
*/
