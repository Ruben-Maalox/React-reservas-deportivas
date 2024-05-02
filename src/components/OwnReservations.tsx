import { useEffect, useState } from "react";
import reservationsJSON from "../json_prueba/reservas.json";
// --> Types
import { Reserva } from "../types/types";

export default function OwnReservations() {
  const [reservations, setReservations] = useState<Reserva[]>();

  useEffect(() => {
    // aquí haríamos el fetching de los datos de reservas para ese usuario concreto
    // Lo suyo sería recibir de la BD un JSON ya preparado tanto con el ID de instalación como con el nombre de la instalación. Para mostrarle al usuario el nombre pero nosotros trabajar con el ID para delete, update etc
    const filteredReservations = reservationsJSON.filter((reserva) => reserva.idUsuario === 1);
    setReservations(filteredReservations);
  }, []);

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID Reserva</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID Usuario</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID Instalación</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations &&
            reservations.map((reserva, index) => {
              const { ID, idUsuario, idInstalacion, fechaYHora, duracion, importe } = reserva;
              const [date, timeWithZone] = fechaYHora.split("T");
              const [time, _] = timeWithZone.split("+");
              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{idUsuario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{idInstalacion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{duracion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{importe}€</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}
