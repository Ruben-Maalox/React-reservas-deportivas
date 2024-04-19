import logo from "../assets/images/logo-white-transp.png";
import NavLinks from "./navegation/NavLinks";

export default function Header() {
  return (
    <header className="flex flex-row items-center justify-between p-5 bg-white shadow-md">
      <img src={logo} alt="logo" />
      <div className="flex items-center justify-between">
        <NavLinks />
      </div>
    </header>
  );
}
