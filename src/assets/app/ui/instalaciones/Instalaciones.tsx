import { table } from "console";
import { Instalacion, InstalacionesAPI } from "../../types/types";
import { useState, useEffect } from "react";

export default function Instalaciones({ token }: { token: string }) {
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([]);

  useEffect(() => {
    const fetchInstalaciones = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/instalaciones", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("authToken")}`, //❌ aquí
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        data.instalaciones.forEach((instalacion: Instalacion) => console.log(instalacion.nombre));

        setInstalaciones(data.instalaciones);
      }
    };

    fetchInstalaciones();
  }, [token]);

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio hora</th>
        </tr>
      </thead>
      <tbody>
        {instalaciones.map((instalacion) => {
          return (
            <tr key={instalacion.id}>
              <td>{instalacion.id}</td>
              <td>{instalacion.nombre}</td>
              <td>{instalacion.precioHora}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* TODO
- Ver cómo recuperar el token de la cookie o de la sesión
*/
