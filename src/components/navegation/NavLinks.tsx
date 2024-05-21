import { Link, useLocation } from 'react-router-dom';
import { useAuthProvider } from '../../context/useAuthProvider';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { useEffect, useRef } from 'react';
import userDefaultImage from '../../assets/images/user.png';
import './NavLinks.css';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Instalaciones', href: '/instalaciones' },
  { name: 'Servicios', href: '/servicios' },
  { name: 'Reservas', href: '/reservas' },
  { name: 'Restaurante', href: '/restaurante' },
  { name: 'Localización y contacto', href: '/contacto' },
];

export default function NavLinks() {
  const { user, setUser } = useAuthProvider();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfoRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleLogOut = () => {
    if (user?.fromGoogle) {
      googleLogout();
    }
    setUser(null);
    localStorage.removeItem('loggedUser');
    navigate('/');
  };

  const userImage = user?.picture ? user.picture : userDefaultImage;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userInfoRef.current &&
        !userInfoRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        inputRef.current.checked = false;
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-300 md:flex-none md:justify-start md:p-2 md:px-3
          ${location.pathname === link.href ? 'bg-gray-200 font-bold' : ''}
          ${link.href === '/auth-page' && 'text-green-600 font-bold'}
          `}
        >
          <p className="md:block">{link.name}</p>
        </Link>
      ))}

      {!user && (
        <Link
          key={'AuthPage'}
          to={'/auth-page'}
          className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-300 md:flex-none md:justify-start md:p-2 md:px-3 
        ${location.pathname === '/auth-page' ? 'bg-gray-200 font-bold' : ''}
        `}
        >
          <p className="md:block text-green-600 font-bold">Iniciar sesión</p>
        </Link>
      )}

      {user && user.isAdmin && (
        <Link
          key="AdminPage"
          to="/adminPage"
          className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-300 md:flex-none md:justify-start md:p-2 md:px-3
            ${location.pathname === '/adminPage' ? 'bg-gray-200 font-bold' : ''}
            `}
        >
          <p className="md:block text-blue-500 font-bold">Admin</p>
        </Link>
      )}

      {user && (
        <div className="flex flex-col items-center relative">
          <label className="user-info-button" htmlFor="userImgProfile">
            <img src={userImage} alt="User image" className="w-16 h-16 rounded-full object-cover" />
          </label>

          <input id="userImgProfile" type="checkbox" hidden ref={inputRef} />

          <aside className="user-info" ref={userInfoRef}>
            <div className="flex flex-col">
              <div className="items-center mt-4">
                <p className="text-lg">
                  <span className="font-bold">Usuario/a:</span> {user?.name}
                </p>
                <p
                  onClick={() => navigate('/user-edit')}
                  className="cursor-pointer hover:bg-[#a0d8f1] hover:shadow-[0_4px_8px_0_#4a90e2] transition-all duration-300 rounded p-1"
                >
                  Información personal
                </p>
              </div>
              <button
                onClick={handleLogOut}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full mt-2 text-s"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
