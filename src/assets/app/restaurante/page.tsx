import Image from "next/image"

export default function RestaurantePage(){
  return(
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 text-black">
      <h1>ESTA ES LA PÁGINA DEL RESTAURANTE</h1>
      <Image src="/images/figma/restaurante.png" alt="Pagina del restaurante" width={500} height={500}/>
    </main>
  )
}