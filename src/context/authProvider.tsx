import { createContext, useState, Dispatch, SetStateAction } from "react";

interface AuthContextType {
  user: any; // Reemplaza 'any' con el tipo de tu usuario
  setUser: Dispatch<SetStateAction<any>>; // Reemplaza 'any' con el tipo de tu usuario
}

// Proporciona un valor por defecto al crear el contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storedUser = localStorage.getItem("loggedUser");
  const newUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(newUser);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}