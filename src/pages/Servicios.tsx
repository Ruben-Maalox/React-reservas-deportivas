import clasesTenisImg from '../assets/images/servicios/clases-tenis.jpg';
import clasesNatacionImg from '../assets/images/servicios/entrenador-piscina.jpg';
import clasesVolleyImg from '../assets/images/servicios/clases-volleyball.jpg';

export default function Servicios() {
  const images = [
    { src: clasesTenisImg, alt: 'Clases de tenis', descr: 'Clases de tenis para todos los niveles.' },
    { src: clasesNatacionImg, alt: 'Clases de natación', descr: 'Clases de natación con seguimiento del progreso' },
    {
      src: clasesVolleyImg,
      alt: 'Clases de volleyball',
      descr: 'Clases de volleyball desde iniciación hasta federado',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-10 xl:gap-12 m-4">
        {images &&
          images.map((image, index) => {
            return (
              <div
                key={index}
                id={`servicios-${image.alt}`}
                className="overflow-hidden shadow-lg rounded-lg h-96 w-64 cursor-pointer mx-auto md:my-2"
              >
                <img src={image.src} alt={image.alt} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-4">{image.alt}</h2>
                  <p className="mb-2">{image.descr}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
