import Login from "../components/auth/Login";
import backgroundImage from "../assets/images/fondo-reservas.jpg";

export default function Reservas() {
  return (
    <>
       <main 
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="flex min-h-screen flex-col items-center p-24 bg-gray-100 text-black bg-no-repeat bg-cover"
    >
        <Login />
      </main>
    </>
  );
}
