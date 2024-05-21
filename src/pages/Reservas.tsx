import { useState } from 'react';
import backgroundImage from '../assets/images/fondo-reservas.jpg';
import ReservationsTable from '../components/ReservationsTable';
import OwnReservations from '../components/OwnReservations';
import './Reservas.css';

export default function Reservas() {
  const [showOwnReservations, setShowOwnReservations] = useState<boolean>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowOwnReservations(event.target.checked);
  };
  return (
    <>
      <main
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className="relative flex min-h-screen flex-col items-center p-4 bg-gray-100 text-black bg-no-repeat bg-cover pt-20 sm:pt-16 md:pt-8"
      >
        <label className="absolute top-5 right-5 flex flex-col items-center justify-center cursor-pointer">
          <input
            type="checkbox"
            id="toggle"
            checked={showOwnReservations}
            onChange={handleCheckboxChange}
            className="sr-only peer"
          />
          <div className="group peer ring-2 bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600 rounded-full outline-none duration-1000 after:duration-300 w-10 h-5 shadow-md peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:[background:#0D2B39] peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)] after:outline-none after:h-4 after:w-4 after:top-0.5 after:left-9.5 peer-checked:after:translate-x-6 peer-hover:after:scale-125"></div>
          <span className="mt-2 text-md text-white">
            {showOwnReservations ? 'Ver todas las reservas' : 'Ver mis reservas'}
          </span>
        </label>

        {showOwnReservations ? <OwnReservations /> : <ReservationsTable />}
      </main>
    </>
  );
}
