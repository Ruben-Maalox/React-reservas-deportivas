import { Carousel } from 'react-responsive-carousel';
import { FaBirthdayCake, FaBeer, FaUtensils, FaRunning } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import restaurantImage1 from '../assets/images/restaurant1.jpg';
import restaurantImage2 from '../assets/images/restaurant2.jpg';
import restaurantImage3 from '../assets/images/restaurant3.jpg';

export default function Restaurante() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center mt-5">¡Bienvenidos al Restaurante LetsMove!</h1>
      <div className="flex flex-wrap items-center">
        <div className="w-full md:w-1/2 p-4 ">
          <p className="text-lg leading-relaxed mb-4">
            En nuestro restaurante, fusionamos la pasión por el deporte con la deliciosa gastronomía, creando un espacio
            acogedor para todos, ya sean deportistas habituales o visitantes que buscan una experiencia culinaria única.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Ubicado en el corazón de nuestro centro deportivo, ofrecemos un ambiente relajado y vibrante que invita a
            disfrutar de una excelente comida en cualquier momento del día. Desde desayunos energéticos hasta cenas
            reconfortantes, nuestra carta cuenta con una variedad de platos frescos y sabrosos que satisfacen todos los
            gustos y necesidades.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Nuestro equipo de chefs expertos utiliza ingredientes frescos y de alta calidad para crear una experiencia
            culinaria inolvidable. Desde opciones saludables que te ayudarán a mantenerte en forma hasta indulgentes
            caprichos que te harán agua la boca, tenemos algo para todos los paladares. Además, para acompañar tu
            comida, ofrecemos una selección de bebidas refrescantes, desde batidos y zumos naturales hasta cócteles y
            vinos seleccionados.
          </p>
          <p className="text-lg leading-relaxed">
            Ya sea que estés aquí para recargar energías después de un entrenamiento, disfrutar de una comida con amigos
            o simplemente deleitarte con nuestra cocina, te invitamos a descubrir la experiencia única que ofrecemos en
            el Restaurante del Centro de Pistas Deportivas. ¡Esperamos verte pronto!
          </p>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
            <div>
              <img src={restaurantImage1} alt="Imagen 1" />
            </div>
            <div>
              <img src={restaurantImage2} alt="Imagen 2" />
            </div>
            <div>
              <img src={restaurantImage3} alt="Imagen 3" />
            </div>
          </Carousel>
        </div>

        <div className="w-full md:w-3/4 mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Organizamos todo tipo de eventos</h2>
          <div className="flex flex-wrap justify-around">
            <div className="w-full md:w-1/4 p-4 flex flex-col items-center">
              <FaRunning className="mb-2 border-2 border-gray-300 p-2 rounded-full" size={70} color="green" />
              <h3 className="font-bold mb-2">Actividades</h3>
              <p className="text-center">
                Si necesitas un espacio en el que organizar tu evento particular o de empresa, te ofrecemos nuestras
                instalaciones.
              </p>
            </div>
            <div className="w-full md:w-1/4 p-4 flex flex-col items-center">
              <FaBirthdayCake className="mb-2 border-2 border-gray-300 p-2 rounded-full" size={70} color="green" />
              <h3 className="font-bold mb-2">Cumpleaños</h3>
              <p className="text-center">
                Ven a celebrar tu cumpleaños en nuestras instalaciones. Te organizamos un torneo junto a todos tus
                amigos.
              </p>
            </div>
            <div className="w-full md:w-1/4 p-4 flex flex-col items-center">
              <FaBeer className="mb-2 border-2 border-gray-300 p-2 rounded-full" size={70} color="green" />
              <h3 className="font-bold mb-2">After Work</h3>
              <p className="text-center">
                No hay plan mejor que terminar de trabajar, hacer deporte y disfrutar de unas cervezas después del
                trabajo.
              </p>
            </div>
            <div className="w-full md:w-1/4 p-4 flex flex-col items-center ">
              <FaUtensils className="mb-2 border-2 border-gray-300 p-2 rounded-full" size={70} color="green" />
              <h3 className="font-bold mb-2">Menú Diario</h3>
              <p className="text-center">
                Estamos abiertos los 7 días de la semana, te ofrecemos menú diario con 3 platos, postre, bebida y café
                por 8,00 €.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
