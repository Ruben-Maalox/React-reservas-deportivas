import { useMemo, useState } from 'react';
import InstallationsAdmin from '../components/admin/InstallationsAdmin';
import ReservationsAdmin from '../components/admin/ReservationsAdmin';

export default function AdminPage() {
  const [showInstallationsAdmin, setShowInstallationsAdmin] = useState<boolean>(false);
  const [showReservationsAdmin, setShowReservationsAdmin] = useState<boolean>(false);

  const installationsButtonText = useMemo(() => {
    return showInstallationsAdmin ? 'Ocultar Instalaciones' : 'Mostrar Instalaciones';
  }, [showInstallationsAdmin]);

  const reservationsButtonText = useMemo(() => {
    return showReservationsAdmin ? 'Ocultar Reservas' : 'Mostrar Reservas';
  }, [showReservationsAdmin]);

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={() => setShowInstallationsAdmin(!showInstallationsAdmin)}
          className="px-4 py-2 bg-blue-500 text-white text-lg font-bold rounded hover:bg-blue-700"
        >
          {installationsButtonText}
        </button>
        <button
          onClick={() => setShowReservationsAdmin(!showReservationsAdmin)}
          className="px-4 py-2 bg-green-500 text-white text-lg font-bold rounded hover:bg-green-700 ml-4"
        >
          {reservationsButtonText}
        </button>
      </div>

      {showInstallationsAdmin && <InstallationsAdmin />}
      {showReservationsAdmin && <ReservationsAdmin />}
    </>
  );
}
