import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-center">404 - Página No Encontrada</h1>
      <p className="text-center mb-4">Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/" className="text-blue-500 hover:underline text-center">
        Volver a la página principal
      </Link>
    </div>
  );
};

export default NotFound;
