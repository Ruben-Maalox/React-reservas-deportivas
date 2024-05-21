import { useState, useMemo } from 'react';
import { ReservaModal } from '../types/types';
import { useAuthProvider } from '../context/useAuthProvider';

export interface ReservaModalProps {
  reservationData: ReservaModal;
  handleCloseModal: () => void;
}

export const Modal = ({ reservationData, handleCloseModal }: ReservaModalProps) => {
  const { precioHora, fechaYHora, nombreInstalacion, duracion, idInstalacion } = reservationData; // Destructuramos el objeto reservationData
  const [currentDuration, setCurrentDuration] = useState(duracion[0]);
  const { user } = useAuthProvider();
  console.log(reservationData);
  // Esta función nos permite calcular el importe cada vez que cambie la duración
  const importe = useMemo(() => {
    return ((currentDuration / 60) * precioHora).toFixed(2) + '€';
  }, [currentDuration]);

  // Desestructuramos la fecha y la hora de la reserva para mostrarlas por separado
  const [date, timeWithZone] = fechaYHora.split('T');
  const [time, _] = timeWithZone.split('+');

  // Función para manejar la reserva
  const handleAddReservation = async () => {
    const reservationDetails = {
      fecha: date,
      hora: time,
      duracion: currentDuration,
      importe: ((currentDuration / 60) * precioHora).toFixed(2),
      idInstalacion: idInstalacion,
    };
    console.log(reservationDetails);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/reservas/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(reservationDetails),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Puedes mostrar un mensaje de éxito o realizar alguna otra acción
        handleCloseModal(); // Cerrar el modal
      } else {
        const errorData = await response.json();
        alert(errorData.message); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al crear la reserva.');
    }
  };

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
        <button
          onClick={handleAddReservation}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
        >
          Añadir Reserva
        </button>
      </div>
    </div>
  );
};
