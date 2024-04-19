import Image from "next/image"

export default function InstalacionesPage(){
  return(
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 text-black">
      <h1>ESTA ES LA PÁGINA DE INSTALACIONES DEPORTIVAS</h1>
      <Image src="/images/figma/instalaciones-deportivas.png" alt="Instalaciones deportivas" width={1000} height={1000}/>
    </main>
  )
}