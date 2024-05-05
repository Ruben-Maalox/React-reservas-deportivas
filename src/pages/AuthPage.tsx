import { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ErrorAuth from "../components/auth/ErrorAuth";
import useError from "../hooks/useError";

export default function AuthPage(){
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const {showError, setShowError} = useError(5000);

  return(
    <div className="relative flex justify-center mt-4">
      {showError && <ErrorAuth />}
      {showLogin ? <Login setShowLogin={setShowLogin} setShowError={setShowError}/> : <Register setShowLogin={setShowLogin} setShowError={setShowError}/>}
    </div>
  )
}