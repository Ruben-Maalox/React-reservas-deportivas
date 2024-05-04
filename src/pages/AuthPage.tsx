import { useState, useEffect } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ErrorAuth from "../components/auth/ErrorAuth";

export default function AuthPage(){
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    let timer : any;
    if (showError) {
      timer = setTimeout(() => {
        setShowError(false);
      }, 5000); // Cambia esto al número de milisegundos que quieras
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showError]);

  return(
    <div className="relative flex justify-center mt-4">
      {showError && <ErrorAuth />}
      {showLogin ? <Login setShowLogin={setShowLogin} setShowError={setShowError}/> : <Register setShowLogin={setShowLogin} setShowError={setShowError}/>}
    </div>
  )
}