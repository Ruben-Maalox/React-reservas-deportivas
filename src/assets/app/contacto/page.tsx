import Image from "next/image";

export default function ContactoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 text-black">
      <h1>ESTA ES LA PÁGINA DE CONTACTO</h1>
      <Image src="/images/figma/contacto.jpg" alt="Pagina de contacto" width={500} height={500} />
    </main>
  );
}
