import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineHome,
  AiOutlineClockCircle,
} from "react-icons/ai";

export default function Contacto() {
  const ubicacionEmpresa = {
    lat: 38.00519, // reemplaza con la latitud de tu empresa
    lng: -1.1628, // reemplaza con la longitud de tu empresa
  };

  return (
    <>
      <div className="flex items-center justify-between py-10 px-5 md:px-20 bg-gray-100">
        <div className="w-full md:w-1/2">
          <LoadScript googleMapsApiKey="AIzaSyD5cPRPxRqgt79povW5F_F8QYJT_AZRVN4">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "500px" }}
              center={ubicacionEmpresa}
              zoom={15}
            >
              <Marker position={ubicacionEmpresa} />
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="w-full md:w-1/2 md:pl-10 flex flex-col justify-center">
          <h2 className="font-bold text-lg mb-2">Contacto:</h2>
          <p className="mb-2">
            <AiOutlinePhone className="inline-block mr-1" />
            <span className="font-bold">Teléfono:</span> 968 111 111 - 637 111
            111
          </p>
          <p className="mb-2">
            <AiOutlineMail className="inline-block mr-1" />
            <span className="font-bold">Email:</span> letsmove@letsmove.com
          </p>
          <p className="mb-2">
            <AiOutlineHome className="inline-block mr-1" />
            <span className="font-bold">Dirección:</span> C. Maestro Pedro Perez
            Abadia, 2A, 30100 Espinardo, Murcia
          </p>

          <div className="mt-5">
            <h2 className="font-bold text-lg mb-2">Horario:</h2>
            <p className="mb-1">
              <AiOutlineClockCircle className="inline-block mr-1" />
              <span className="font-bold">Lunes - Viernes:</span> 9:00 - 23:00
            </p>
            <p className="mb-1">
              <AiOutlineClockCircle className="inline-block mr-1" />
              <span className="font-bold">Sábado:</span> 10:00 - 14:00
            </p>
            <p className="mb-1">
              <AiOutlineClockCircle className="inline-block mr-1" />
              <span className="font-bold">Domingo:</span> Cerrado
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
