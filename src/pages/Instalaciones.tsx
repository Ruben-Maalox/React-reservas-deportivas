import baloncestoImg from '../assets/images/instalaciones/baloncesto.jpg';
import futbolSalaImg from '../assets/images/instalaciones/futbol-sala.jpg';
import padelImg from '../assets/images/instalaciones/pista-padel.png';
import piscinaImg from '../assets/images/instalaciones/piscina.jpg';
import tenisImg from '../assets/images/instalaciones/tenis.jpg';
import futbol7Img from '../assets/images/instalaciones/futbol7.jpg';
import volleyballImg from '../assets/images/instalaciones/volleyball.jpg';

export default function Instalaciones() {
  const images = [
    { src: baloncestoImg, alt: 'Pista de baloncesto' },
    { src: futbolSalaImg, alt: 'Pista de futbol sala' },
    { src: padelImg, alt: 'Pista de padel' },
    { src: piscinaImg, alt: 'Piscina' },
    { src: tenisImg, alt: 'Pista de tenis' },
    { src: futbol7Img, alt: 'Campo de futbol 7' },
    { src: volleyballImg, alt: 'Pista de volleyball' },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 md:gap-10 m-4 xl:grid-cols-3 xl:gap-10">
        {images.map((image, index) => (
          <div key={index} className="overflow-hidden shadow-lg rounded-lg h-80 w-64 cursor-pointer mx-auto md:my-2">
            <img alt={image.alt} src={image.src} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h1 className="text-xl font-bold">{image.alt}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* TODO
- Mejorar la optimización de las imágenes (tardan mucho en cargar)
*/
