import { useEffect, useState } from "react";
// import reservationsJSON from "../json_prueba/reservas.json";
// --> Types
import { OwnReserva } from "../types/types";
import { useAuthProvider } from "../context/useAuthProvider";

export default function OwnReservations() {
  const [ownReservations, setOwnReservations] = useState<OwnReserva[]>();
  const { user } = useAuthProvider();


  useEffect(() => {
    fetch("http://localhost:8000/api/reservas/userEmail", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setOwnReservations(data.results);
        }

      });
  }, []);

  return (
    <>
      <table className="min-w-full text-center">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID Reserva</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID Usuario</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Instalacion</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ownReservations &&
            ownReservations.map((reserva, index) => {
              const { id, idUsuario, idInstalacion, nombreInstalacion, fechaYHora, duracion, importe } = reserva;
              const [date, timeWithZone] = fechaYHora.split("T");
              const [time, _] = timeWithZone.split("+");
              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{idUsuario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center" data-id={idInstalacion}>{nombreInstalacion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{duracion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{importe}€</td>
                  <td className="flex flex-row px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex pl-16">
                    <img src="src/assets/icons/edit.svg" alt="Edit icon" className="w-10 h10"/>
                    <img src="src/assets/icons/delete.svg" alt="Delete icon" className="w-10 h10"/>
                  </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}
