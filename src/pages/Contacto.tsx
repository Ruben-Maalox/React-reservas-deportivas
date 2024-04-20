import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export default function Contacto() {
  const ubicacionEmpresa = {
    lat: 38.00519, // reemplaza con la latitud de tu empresa
    lng: -1.16280, // reemplaza con la longitud de tu empresa
  };

  return (
    <>
      <h1>Esta es la página CONTACTO</h1>
      <LoadScript googleMapsApiKey="AIzaSyD5cPRPxRqgt79povW5F_F8QYJT_AZRVN4">
        <GoogleMap
          mapContainerStyle={{ width: '500px', height: '500px' }}
          center={ubicacionEmpresa}
          zoom={15}
        >
          <Marker position={ubicacionEmpresa} />
        </GoogleMap>
      </LoadScript>
    </>
  );
}