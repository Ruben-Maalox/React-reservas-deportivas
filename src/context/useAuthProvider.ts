import { useContext } from "react";
import { AuthContext } from "./authProvider";

export function useAuthProvider(){
  const { user, setUser, updateUser} = useContext(AuthContext);

  return { user, setUser, updateUser};
}