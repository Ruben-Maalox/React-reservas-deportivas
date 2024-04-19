import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100 text-black">
      <h1>ESTA ES LA PÁGINA DE INICIO (Tenemos que crear la landing page)</h1>
      <Image src="/images/figma/home.png" alt="Pagina de inicio" width={1000} height={500}/>
    </main>
  );
}

/* TODO
- Restringir el acceso a las páginas de Reservas y Restaurante si el usuario no está logueado.
- Cambiar el JSON que devuelven las instalaciones (ahora mismo tenemos ID, Nombre y precioHora. Sería mejor id, nombre, tipoInstalacion, precioHora)?? 
*/