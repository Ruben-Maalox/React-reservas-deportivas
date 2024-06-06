import { useState } from 'react';
import logo from '../assets/images/logo-white-transp.png';
import NavLinks from './navegation/NavLinks';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="flex flex-row items-center justify-between p-5 bg-white shadow-md relative">
      <Link to="/">
        <img src={logo} alt="logo" className="h-20 w-64" />
      </Link>
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6 text-gray-500"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6 text-gray-500"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <div
        className={`lg:flex ${isOpen ? 'block' : 'hidden'} lg:items-center lg:relative lg:top-auto lg:w-auto lg:left-auto lg:transform-none absolute w-full top-full left-1/2 transform -translate-x-1/2 right-0 bg-white z-30 `}
      >
        <NavLinks onClick={handleLinkClick} />
      </div>
    </header>
  );
}
