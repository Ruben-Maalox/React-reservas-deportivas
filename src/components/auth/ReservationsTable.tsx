import { useState, useEffect } from "react";
import Login from "./Login";

// import Register from "../register/Register";

export default function ReservationsTable() {
  const [token, setToken] = useState<string>("");
  const [instalaciones, setInstalaciones] = useState<any[]>([]); // <-- [hour, pista
  const [urlInfo, setUrlInfo] = useState<string>(""); // <-- [hour, pista
  const [showRegistro, setShowRegistro] = useState<boolean>(false); // Nuevo estado para controlar la visualización del componente de registro

  useEffect(() => {
    
    fetch("http://localhost:8000/api/instalaciones/all")
      .then((response) => response.json())
      .then((data) => setInstalaciones(data.instalaciones));
  }, [])
  
  
  
  const handleClick = (hour: number) => {
    // Comprobar aquí inicio de sesión

    // Si NO HAY sesión iniciada, mostrar el componente de inicio/registro
    setShowRegistro(true);
    setUrlInfo(`?hour=${hour}`)

    // Si hay sesión iniciada, redireccionar a /reservas/pistas con la info en la URL

    // pasar parámetros por URL
    // history.push(`/reservas/pistas/${hour}`);
  };
  
  if(token !== ""){
    // Que nos lleve a --> ConfirmarReserva.tsx
    console.log("El token es" + token);
    console.log("REDIRECCIONAME A ConfirmarReserva");
  }

  console.log(urlInfo)

  return (
    <>
      {instalaciones.length > 0 && !showRegistro && (
        <table className="bg-white w-full text-center">
          <thead>
            <tr>
              <th>Horas</th>
              {instalaciones.map((instalacion)=>{
                return <th key={instalacion.id}>{instalacion.nombre}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
              <tr key={hour} onClick={() => handleClick(hour)}>
                <td>{`${hour}:00 - ${hour + 1}:00`}</td>
                <td>Libre</td>
                <td>Libre</td>
                <td>Libre</td>
                <td>Libre</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showRegistro && token === "" && <Login setToken={setToken}/>}
      {token !== "" && <p className="bg-white">Redireccionando...</p>}
    </>
  );
}

/* TODO:
- Ver dónde guardar el token recibido de la API para futuras peticiones
- Ponemos el recordar inicio de sesión en un checkbox??
*/
