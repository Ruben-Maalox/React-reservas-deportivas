import { useState, useMemo } from "react";
import { ReservaModal } from "../types/types";

export interface ReservaModalProps {
  reservationData: ReservaModal;
  handleCloseModal: () => void;
}

export const Modal = ({ reservationData, handleCloseModal }: ReservaModalProps) => {
  const { precioHora, fechaYHora, nombreInstalacion, duracion } = reservationData; // Destructuramos el objeto reservationData
  const [currentDuration, setCurrentDuration] = useState(duracion[0]);

  // Esta función nos permite calcular el importe cada vez que cambie la duración
  const importe = useMemo(() => {
    return ((currentDuration / 60) * precioHora).toFixed(2) + "€";
  }, [currentDuration]);

  // Desestructuramos la fecha y la hora de la reserva para mostrarlas por separado
  const [date, timeWithZone] = fechaYHora.split("T");
  const [time, _] = timeWithZone.split("+");

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="bg-white p-5 rounded shadow-lg w-full max-w-sm m-auto relative">
        <button onClick={handleCloseModal} className="absolute right-2 top-2 text-lg font-bold">
          x
        </button>
        <h2 className="text-center">Reserva</h2>
        <p className="">Instalación: {nombreInstalacion}</p>
        <p>Fecha: {date}</p>
        <p>Hora: {time}</p>
        <div className="mb-3">
          <label>Duración: </label>
          <select value={currentDuration} onChange={(e) => setCurrentDuration(parseInt(e.target.value))}>
            {duracion.map((duracion, indx) => (
              <option key={indx} value={duracion}>
                {duracion} minutos
              </option>
            ))}
          </select>
        </div>
        <p>Importe: {importe}</p>
      </div>
    </div>
  );
};
