import { useState, useEffect } from "react";
import Login from "./auth/Login";
import { INSTALACIONES_INFO } from "../constants/constants";
import reservasJSON from "../json_prueba/reservas.json";
import { Reserva } from "../types/types";

// import Register from "../register/Register";

export default function ReservationsTable() {
  const [token, setToken] = useState<string>("");
  const [instalaciones, setInstalaciones] = useState<any[]>([]); // <-- [hour, pista
  const [reservas, setReservas] = useState<Reserva[] | null>(null); // <-- [hour, pista
  const [urlInfo, setUrlInfo] = useState<string>(""); // <-- [hour, pista
  const [showRegistro, setShowRegistro] = useState<boolean>(false); // Nuevo estado para controlar la visualización del componente de registro

  useEffect(() => {
    /* fetch("http://localhost:8000/api/instalaciones/all")
      .then((response) => response.json())
      .then((data) => setInstalaciones(data.instalaciones)); */
    setInstalaciones(INSTALACIONES_INFO);
    const filteredReservas = reservasJSON.filter((reserva) => reserva.fecha === "2024-04-24");
    setReservas(filteredReservas);
    console.log(filteredReservas);
  }, []);

  const handleClick = (hour: number) => {
    // Comprobar aquí inicio de sesión

    // Si NO HAY sesión iniciada, mostrar el componente de inicio/registro
    setShowRegistro(true);
    setUrlInfo(`?hour=${hour}`);

    // Si hay sesión iniciada, redireccionar a /reservas/pistas con la info en la URL

    // pasar parámetros por URL
    // history.push(`/reservas/pistas/${hour}`);
  };

  if (token !== "") {
    // Que nos lleve a --> ConfirmarReserva.tsx
    console.log("El token es" + token);
    console.log("REDIRECCIONAME A ConfirmarReserva");
  }

  console.log(urlInfo);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevDay = () => {
    setSelectedDate((prevDate) => new Date(new Date(prevDate).setDate(prevDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => new Date(new Date(prevDate).setDate(prevDate.getDate() + 1)));
  };
  // const today = new Date();
  const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };

  function hasReserva(idInstalacion: string, hora: string) {
    return reservas?.find((reserva) => reserva.idInstalacion == idInstalacion && reserva.hora === hora);
  }

  return (
    <>
      {instalaciones.length > 0 && !showRegistro && (
        <div className="w-full md:w-2/3 lg:w-3/4 mx-auto bg-white rounded-lg p-4">
          <h1 className="font-bold text-center text-3xl mb-5">Reservas</h1>
          <div className="flex bg-gray-200 items-center p-3">
            <label htmlFor="reservation-date" className="block text-sm font-medium text-gray-700 mr-3">
              Fecha:
            </label>
            <button onClick={handlePrevDay} className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 px-3 rounded">
              &lt;
            </button>
            <input type="date" id="reservation-date" value={formattedDate} onChange={handleDateChange} className="mt-1 block pl-3 pr-5 sm:text-sm border-gray-300 rounded-md" />
            <button onClick={handleNextDay} className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 px-3 rounded">
              &gt;
            </button>
          </div>
          <table className=" w-full text-center">
            <thead>
              <tr>
                {instalaciones.map((instalacion) => {
                  return (
                    <th key={instalacion.id} data-id={instalacion.id} className="p-4">
                      {instalacion.nombre}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 29 }, (_, i) => i + 18).map((halfHour) => {
                const hour1 = Math.floor(halfHour / 2) % 24;
                const hour2 = hour1 >= 10 ? hour1 : `0${hour1}`;
                const time = `${hour2}:${halfHour % 2 === 0 ? "00" : "30"}`;
                return (
                  <tr key={halfHour} data-hour={time}>
                    {instalaciones.map((instalacion) => {
                      const reserva = hasReserva(instalacion.id, time);

                      /* 
                      --> Fusionar columnas???
                      let fusionarColumnas = 1;
                      if (reserva && reserva.duracion === "60") {
                        fusionarColumnas = 2;
                      }
                      if (reserva && reserva.duracion === "90") {
                        fusionarColumnas = 3;
                      } */

                      return (
                        <td key={instalacion.id} data-instalacion={instalacion.id} className={`border ${reserva ? "bg-red-500" : ""} `}>
                          {time}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {showRegistro && token === "" && <Login setToken={setToken} />}
      {token !== "" && <p className="bg-white">Redireccionando...</p>}
    </>
  );
}

/* TODO:
- Ver dónde guardar el token recibido de la API para futuras peticiones
*/
