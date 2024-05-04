import { createContext, useState, Dispatch, SetStateAction } from "react";

interface AuthContextType {
  user: User | null; 
  setUser: Dispatch<SetStateAction<User | null>>; 
}

// Proporciona un valor por defecto al crear el contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storedUser = localStorage.getItem("loggedUser");
  const newUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState<User | null>(newUser);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export interface User {
  email: string;
  name: string;
  token: string;
  picture?: string;
  fromGoogle: boolean;
}