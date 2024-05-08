import "./Home.css";
import homeImage from "../assets/images/campo-futbol.png";
import girlImage from "../assets/images/deporte.png";
import whatsapp from "../assets/icons/whatsapp.svg";
import heart from "../assets/icons/heart.svg";
import sneakers from "../assets/icons/sneakers.svg";

// export default function Home() {
//   return (
//     <>
//       <div className="flex flex-col items-center">
//         <img src={homeImage} alt="Carrusel de imágenes" />

//         <div id="home-info" className="flex flex-row w-full">
//           <div className="flex flex-row p-4 justify-center items-center w-1/3" style={{ backgroundColor: "#959595" }}>
//             <img className="m-4" src={sneakers} alt="Whatsapp" style={{width: "150px"}} />
//             <div className="flex flex-col items-center">
//               <p className="text-white">Instalaciones de alta calidad</p>
//               <h2 className="text-white">Disfruta!</h2>
//             </div>
//           </div>
//           <div className="flex flex-row p-4 justify-center items-center w-1/3" style={{ backgroundColor: "#78A890" }}>
//             <img className="m-4" src={whatsapp} alt="Whatsapp" />
//             <div className="flex flex-col items-center">
//               <p className="text-white">Infórmate sin compromiso</p>
//               <h2 className="text-white">+34 662 662 662</h2>
//             </div>
//           </div>
//           <div className="flex flex-row p-4 justify-center items-center w-1/3" style={{ backgroundColor: "#C3E5D4" }}>
//             <img className="m-4" src={heart} alt="Whatsapp" />
//             <div className="flex flex-col items-center">
//               <p className="">Ven a divertite</p>
//               <h2 className="">Let's move!</h2>
//             </div>
//           </div>
//         </div>

//         <div id="historia" className="flex flex-row">
//           <div className="w-1/2 p-6">
//             <h1>Nuestra historia</h1>
//             <p>
//               Todo comenzó con la visión de crear un espacio donde la pasión por el deporte y la vida activa se unieran en un ambiente vibrante y acogedor. Lets Move nació de esa visión, con el objetivo de ofrecer un lugar único donde las personas pudieran disfrutar de una amplia variedad de
//               actividades deportivas y de recreación en un solo lugar.
//             </p>
//             <p>Lets Move es mucho más que un simple centro deportivo. Contamos con una amplia gama de instalaciones de primera calidad para satisfacer todas las necesidades de nuestros miembros, incluyendo:</p>
//             <ul className="list-disc list-inside">
//               <li>1 pista de tenis 1</li>
//               <li>1 campos de fútbol 7</li>
//               <li>2 pistas de pádel</li>
//               <li>1 campos de fútbol sala </li>
//               <li>1 cancha de baloncesto </li>
//               <li>Piscina cubierta </li>
//               <li>Pista de voleibol</li>
//             </ul>
//             <p>
//               En Lets Move, nos enorgullecemos de ofrecer mucho más que solo instalaciones deportivas. También brindamos una variedad de servicios adicionales para mejorar la experiencia de nuestros miembros, incluyendo vestuarios completos, servicios de fisioterapia, nutrición y preparación física.
//             </p>
//             <p>
//               Y para aquellos momentos en los que necesitas recargar energías, nuestro restaurante especializado en cocina regional de Murcia te espera con una deliciosa selección de platos y tapas típicas. Únete a nosotros en Lets Move y descubre por qué somos el destino preferido para los amantes
//               del deporte y la vida activa en Murcia. ¡Te esperamos para formar parte de nuestra emocionante historia!
//             </p>
//           </div>
//           <div className="w-1/2">
//             <img src={girlImage} alt="Girl running"/>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center">
        <img src={homeImage} alt="Carrusel de imágenes" />

        <div id="home-info" className="flex flex-col md:flex-row w-full">
          <div className="flex flex-row p-4 justify-center items-center w-full md:w-1/3" style={{ backgroundColor: "#959595" }}>
            <img className="m-4" src={sneakers} alt="Whatsapp" style={{width: "150px"}} />
            <div className="flex flex-col items-center">
              <p className="text-white">Instalaciones de alta calidad</p>
              <h2 className="text-white">Disfruta!</h2>
            </div>
          </div>
          <div className="flex flex-row p-4 justify-center items-center w-full md:w-1/3" style={{ backgroundColor: "#78A890" }}>
            <img className="m-4" src={whatsapp} alt="Whatsapp" />
            <div className="flex flex-col items-center">
              <p className="text-white">Infórmate sin compromiso</p>
              <h2 className="text-white">+34 662 662 662</h2>
            </div>
          </div>
          <div className="flex flex-row p-4 justify-center items-center w-full md:w-1/3" style={{ backgroundColor: "#C3E5D4" }}>
            <img className="m-4" src={heart} alt="Whatsapp" />
            <div className="flex flex-col items-center">
              <p className="">Ven a divertite</p>
              <h2 className="">Let's move!</h2>
            </div>
          </div>
        </div>

        <div id="historia" className="flex flex-col md:flex-row relative">
          <div className="w-full md:w-1/2 p-6 bg-white md:bg-transparent">
            <h1>Nuestra historia</h1>
            <p>
              Todo comenzó con la visión de crear un espacio donde la pasión por el deporte y la vida activa se unieran en un ambiente vibrante y acogedor. Lets Move nació de esa visión, con el objetivo de ofrecer un lugar único donde las personas pudieran disfrutar de una amplia variedad de
              actividades deportivas y de recreación en un solo lugar.
            </p>
            <p>Lets Move es mucho más que un simple centro deportivo. Contamos con una amplia gama de instalaciones de primera calidad para satisfacer todas las necesidades de nuestros miembros, incluyendo:</p>
            <ul className="list-disc list-inside">
              <li>1 pista de tenis 1</li>
              <li>1 campos de fútbol 7</li>
              <li>2 pistas de pádel</li>
              <li>1 campos de fútbol sala </li>
              <li>1 cancha de baloncesto </li>
              <li>Piscina cubierta </li>
              <li>Pista de voleibol</li>
            </ul>
            <p>
              En Lets Move, nos enorgullecemos de ofrecer mucho más que solo instalaciones deportivas. También brindamos una variedad de servicios adicionales para mejorar la experiencia de nuestros miembros, incluyendo vestuarios completos, servicios de fisioterapia, nutrición y preparación física.
            </p>
            <p>
              Y para aquellos momentos en los que necesitas recargar energías, nuestro restaurante especializado en cocina regional de Murcia te espera con una deliciosa selección de platos y tapas típicas. Únete a nosotros en Lets Move y descubre por qué somos el destino preferido para los amantes
              del deporte y la vida activa en Murcia. ¡Te esperamos para formar parte de nuestra emocionante historia!
            </p>
          </div>
          <div className="w-full md:w-1/2 md:relative ">
            <img src={girlImage} alt="Girl running" className="absolute inset-0 w-full h-full object-cover opacity-40 md:opacity-100"/>
          </div>
        </div>
      </div>
    </>
  );
}