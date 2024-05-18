import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthProvider } from '../../context/useAuthProvider';
import { useNavigate } from 'react-router-dom';
import googleIcon from '../../assets/icons/google.svg';
import { useMediaQuery } from 'react-responsive';

export interface GoogleLoginResponse {
  access_token: string;
  authuser: string;
  expires_in: number;
  prompt: string;
  scope: string;
  token_type: string;
}

export default function GoogleLogin({ setIsLoading }: { setIsLoading: (isLoading: boolean) => void }) {
  const [userGoogle, setUserGoogle] = useState<GoogleLoginResponse>();
  const { setUser } = useAuthProvider();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => setUserGoogle(codeResponse), // {access_token, authuser, expires_in, ... } ❗❗ Si ponemos ANY se va el error, pero tenemos que arreglar
    onError: (error) => console.log('Login Failed:', error),
  });

  // El objeto que tiene el token de haber iniciado sesión correctamente con google lo metemos en el state (userGoogle) y entonces llamamos a la API de google para obtener los datos de ese usuario. Recibiremos -->  {data, family_name, given_name, id, name, picture, verified_email}
  useEffect(() => {
    if (userGoogle) {
      setIsLoading(true);
      fetch(`http://localhost:8000/api/login-google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: userGoogle.access_token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            const { email, name, token, picture } = data.results;
            setUser({ email, name, token, picture, fromGoogle: true });
            window.localStorage.setItem('loggedUser', JSON.stringify({ email, name, token, picture }));
            setIsLoading(false);
            navigate('/reservas');
          }
        })
        .catch((err) => console.log(err));
    }
  }, [userGoogle]);

  return (
    <button
      onClick={() => login()}
      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-500 hover:bg-cyan-600"
    >
      <img src={googleIcon} alt="Google" className="h-5 w-5 mr-3" />
      {isMobile ? 'Sign In 🚀' : 'Sign In with Google 🚀'}
    </button>
  );
}

/* TODO:
- Si en el useState de userGoogle tipamos como GoogleLoginResponse, nos da error en el setUserGoogle(codeResponse)
- Ver por qué tarda tanto en hacer la petición al servidor y mostrar los datos
*/

/* Opción 1 --> Pasarle token al servidor
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

/* Opción 2 --> Hacer la petición desde el propio cliente
- Suele ser más recomendable enviar el token al servidor, y que sea este quien reciba los datos del usuario y los almacene en la BD.

Realizando la petición en el cliente sería:
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
          const { email, given_name, picture } = data;
          setUser({ email, name: given_name, token: userGoogle.access_token, picture });
          window.localStorage.setItem("loggedUser", JSON.stringify(data));
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
