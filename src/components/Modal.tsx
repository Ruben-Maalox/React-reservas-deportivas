import { useState, useMemo } from "react";
import { ReservaModal } from "../types/types";

export interface ReservaModalProps {
  reservationsData: ReservaModal;
  handleCloseModal: () => void;
}

export const Modal = ({ reservationsData, handleCloseModal }: ReservaModalProps) => {
  const [duration, setDuration] = useState(60);

  // Esta función nos permite calcular el importe cada vez que cambie la duración
  const importe = useMemo(() => {
    const precioHora = reservationsData.precioHora;
    return ((duration / 60) * precioHora).toFixed(2) + "€";
  }, [duration]);

  const [date, timeWithZone] = reservationsData.fechaYHora.split("T");
  const [time, _] = timeWithZone.split("+");

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="bg-white p-5 rounded shadow-lg w-full max-w-sm m-auto relative">
        <button onClick={handleCloseModal} className="absolute right-2 top-2 text-lg font-bold">
          x
        </button>
        <h2 className="text-center">Reserva</h2>
        <p className="">Instalación: {reservationsData.nombreInstalacion}</p>
        <p>Fecha: {date}</p>
        <p>Hora: {time}</p>
        <div className="mb-3">
          <label>Duración: </label>
          <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}>
            <option defaultValue={60}>60 minutos</option>
            <option value={90}>90 minutos</option>
          </select>
        </div>
        <p>Importe: {importe}</p>
      </div>
    </div>
  );
};
