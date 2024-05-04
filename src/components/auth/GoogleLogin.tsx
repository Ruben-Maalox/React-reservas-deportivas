import { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useAuthProvider } from "../../context/useAuthProvider";

export interface GoogleLoginResponse{
  access_token: string;
  authuser: string;
  expires_in: number;
  prompt: string;
  scope: string;
  token_type: string;
}

export default function GoogleLogin() {
  const [userGoogle, setUserGoogle] = useState<GoogleLoginResponse | null>();
  const { setUser } = useAuthProvider();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUserGoogle(codeResponse), // {access_token, authuser, expires_in, ... }
    onError: (error) => console.log("Login Failed:", error),
  });

  // El objeto que tiene el token de haber iniciado sesión correctamente con google lo metemos en el state (userGoogle) y entonces llamamos a la API de google para obtener los datos de ese usuario. Recibiremos -->  {data, family_name, given_name, id, name, picture, verified_email}
  useEffect(() => {
    if (userGoogle) {
      fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userGoogle.access_token}`, {
        headers: {
          Authorization: `Bearer ${userGoogle.access_token}`,
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // data: {id, email, family_name, given_name, locale, picture}
          setUser(data);
          window.localStorage.setItem("loggedUser", JSON.stringify(data));
          // Aquí haría petición a mi API de Symfony ??
        })
        .catch((err) => console.log(err));
    }
  }, [userGoogle]);

  // log out function to log the user out of google and set the profile array to null
  // const logOut = () => {
  //   googleLogout();
  //   setUser(null);
  //   window.localStorage.removeItem("loggedUser");
  // };

  return <button onClick={()=>login()} className="bg-black text-white mt-2 p-4">Sign in with Google 🚀 </button>;
}

/* TODO Opción 1 --> Pasarle token al servidor
if (userGoogle) {
      fetch("http://localhost:8000/api/login-google", {
        method: "POST", // o 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: userGoogle.access_token }), //
      })
        .then((response) => response.json())
        .then((data) => {
          // En el servidor devuelvo {ok, token, username, avatar}
          const newUser = { token: data.token, username: data.username, avatar: data.avatar };
          // Guardamos en el LocalStorage el usuario
          window.localStorage.setItem("loggedUser", JSON.stringify(newUser));
          setUser(newUser);
        })
        .catch((error) => console.error("Error:", error));
    }

      return (
    <div>
      <h2>React Google Login</h2>
      <br />
      {user ? (
        <div>
          <img src={user.avatar} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {user.username}</p>
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        <button onClick={login}>Sign in with Google 🚀 </button>
      )}
    </div>
  );
*/

/* TODO Opción 2 --> Hacer la petición desde el propio cliente
- Suele ser más recomendable enviar el token al servidor, y que sea este quien reciba los datos del usuario y los almacene en la BD.

Realizando la petición en el cliente sería:
   if (userGoogle) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userGoogle.access_token}`, {
          headers: {
            Authorization: `Bearer ${userGoogle.access_token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          // res {data: {id, email, family_name, given_name, locale, picture}}
          setUser(res.data);
          window.localStorage.setItem("loggedUser", JSON.stringify(res.data));
          // Aquí haría petición a mi API de Symfony ??
        })
        .catch((err) => console.log(err));

      return (
    <div>
      <h2>React Google Login</h2>
      <br />
      {user ? (
        <div>
          <img src={user.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {user.given_name}</p>
          <p>Email: {user.email}</p>
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        <button onClick={login}>Sign in with Google 🚀 </button>
      )}
    </div>
  );
*/
