import { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

export default function AuthPage(){
  const [showLogin, setShowLogin] = useState<boolean>(true);

  return(
    <div className="flex justify-center mt-4">
      {showLogin ? <Login setShowLogin={setShowLogin}/> : <Register setShowLogin={setShowLogin}/>}
    </div>
  )
}