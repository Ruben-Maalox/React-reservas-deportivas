

export const Modal = ({ reservationsData, installations, handleCloseModal, setReservationsData }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="bg-white p-5 rounded shadow-lg w-full max-w-sm m-auto relative">
        <button onClick={handleCloseModal} className="absolute right-2 top-2 text-lg font-bold">x</button>
        <h2 className="text-center">Reserva</h2>
        <p className="">Instalación: {installations[reservationsData.instalacion]}</p>
        <p>Fecha: {reservationsData.fecha}</p>
        <p>Hora: {reservationsData.hora}</p>
        <div className="mb-3">
          <label>Duración: </label>
          <select value={reservationsData.duracion} onChange={(e) => setReservationsData({...reservationsData, duracion: e.target.value})}>
            <option value="60">60 minutos</option>
            <option value="90">90 minutos</option>
          </select>
        </div>
        <p>Importe: {reservationsData.importe}</p>
      </div>
    </div>
  );
}
