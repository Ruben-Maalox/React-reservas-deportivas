import { Link, useLocation } from "react-router-dom";
import { useAuthProvider } from "../../context/useAuthProvider";
import { useNavigate } from "react-router-dom";

const links = [
  { name: "Home", href: "/" },
  { name: "Instalaciones", href: "/instalaciones" },
  { name: "Servicios", href: "/servicios" },
  { name: "Reservas", href: "/reservas" },
  { name: "Restaurante", href: "/restaurante" },
  { name: "Localización y contacto", href: "/contacto" },

];

export default function NavLinks() {
  const { user, setUser } = useAuthProvider();
  const location = useLocation();
  const navigate = useNavigate();


  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem("loggedUser");
    navigate("/");
  }

  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            to={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-300 md:flex-none md:justify-start md:p-2 md:px-3
            
            ${location.pathname === link.href ? "bg-gray-200 font-bold" : ""}
            `}
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
        <div className="flex flex-col">
        {user && <p>{user?.email} // {user?.name}</p>}
        {user && <button onClick={handleLogOut}>Log Out</button>}
        </div>

    </>
  );
}
