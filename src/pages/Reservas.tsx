import { useState } from "react";
import backgroundImage from "../assets/images/fondo-reservas.jpg";
import ReservationsTable from "../components/ReservationsTable";
import OwnReservations from "../components/OwnReservations";
import "./Reservas.css"

export default function Reservas() {
  const [showOwnReservations, setShowOwnReservations] = useState<boolean>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowOwnReservations(event.target.checked);
  };
  return (
    <>
      <main style={{ backgroundImage: `url(${backgroundImage})` }} className="relative flex min-h-screen flex-col items-center p-24 bg-gray-100 text-black bg-no-repeat bg-cover">
        <div className="absolute top-5 right-5 inline-block w-10 mr-2 align-middle select-none transition duration-500 ease-in">
          <input type="checkbox" name="toggle" id="toggle" checked={showOwnReservations} onChange={handleCheckboxChange} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
          <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
        </div>
        <label htmlFor="toggle" className="text-white absolute top-10 right-10 text-gray-700 font-medium">
          Mostrar solo mis reservas
        </label>
        
        {showOwnReservations ? <OwnReservations /> : <ReservationsTable />}
      </main>
    </>
  );
}
