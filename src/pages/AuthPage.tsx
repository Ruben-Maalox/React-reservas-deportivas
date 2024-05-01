import { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

export default function AuthPage(){
  const [showLogin, setShowLogin] = useState<boolean>(true);

  return(
    showLogin ? <Login setShowLogin={setShowLogin}/> : <Register setShowLogin={setShowLogin}/>
  )
}