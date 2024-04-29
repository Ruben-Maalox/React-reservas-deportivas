import { useContext } from "react";
import { AuthContext } from "./authProvider";

export function useAuthProvider(){
  const { user, setUser } = useContext(AuthContext);

  return { user, setUser };
}