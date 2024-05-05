import { Link, useLocation } from "react-router-dom";
import { useAuthProvider } from "../../context/useAuthProvider";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import userDefaultImage from "../../assets/images/user.png";

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
    if (user?.fromGoogle) {
      googleLogout();
    }
    setUser(null);
    localStorage.removeItem("loggedUser");
    navigate("/");
  };

  const userImage = user?.picture ? user.picture : userDefaultImage;

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
      {user && (
        <div className="flex flex-col items-center">
          <img onClick={()=>navigate("user-info")} src={userImage} alt="User image" className="w-12 h-12 rounded-full object-cover" />

          <button onClick={handleLogOut} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full mt-2 text-s">
            Log Out
          </button>
        </div>
      )}
    </>
  );
}
