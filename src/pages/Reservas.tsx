import { useState, useEffect } from 'react';
import backgroundImage from '../assets/images/fondo-reservas.jpg';
import ReservationsTable from '../components/ReservationsTable';
import OwnReservations from '../components/OwnReservations';
import './Reservas.css';
import { useAuthProvider } from '../context/useAuthProvider';
import { Reserva, Instalacion } from '../types/types';
import useError from '../hooks/useError';

export default function Reservas() {
  const [showOwnReservations, setShowOwnReservations] = useState<boolean>(false);
  const [installations, setInstallations] = useState<Instalacion[]>([]);
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const { error, setError } = useError(3000);
  const [refetch, setRefetch] = useState<boolean>(false);
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
        if (data.error) {
          setError(data.error);
        }
      });

    fetch('http://localhost:8000/api/reservas/all', {
      headers: {
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
  }, [refetch]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowOwnReservations(event.target.checked);
  };

  const handleRefetch = () => {
    setRefetch((prevState) => !prevState);
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
          <div className="group peer ring-2 bg-gradient-to-bl from-blue-500 via-blue-400 to-blue-300 rounded-full outline-none duration-1000 after:duration-300 w-10 h-5 shadow-md peer-focus:outline-none after:content-[''] after:rounded-full after:absolute peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)] after:outline-none after:h-4 after:w-4 after:top-0.5 after:left-9.5 peer-checked:after:translate-x-6 peer-hover:after:scale-125"></div>
          <span className="mt-2 text-md text-blue-100 font-semibold">
            {showOwnReservations ? 'Reservas' : 'Mis reservas'}
          </span>
        </label>

        {showOwnReservations ? (
          <OwnReservations
            handleRefetch={handleRefetch}
            installations={installations}
            reservations={reservations}
            error={error}
            setError={setError}
          />
        ) : (
          <ReservationsTable
            handleRefetch={handleRefetch}
            installations={installations}
            reservations={reservations}
            error={error}
            setError={setError}
            date={new Date()}
          />
        )}
      </main>
    </>
  );
}
