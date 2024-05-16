import { createContext, useState, Dispatch, SetStateAction } from "react";

interface AuthContextType {
  user: User | null; 
  setUser: Dispatch<SetStateAction<User | null>>;
  updateUser: (updatedFields: Partial<User>) => void; // Añade esta línea
}

// Proporciona un valor por defecto al crear el contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  updateUser: () => {}, // Añade esta línea
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storedUser = localStorage.getItem("loggedUser");
  const newUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState<User | null>(newUser);

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((currentUser) => {
      if (currentUser) {
        return { ...currentUser, ...updatedFields };
      }
      return null;
    });
  };

  return <AuthContext.Provider value={{ user, setUser, updateUser }}>{children}</AuthContext.Provider>; // Añade updateUser aquí
}

export interface User {
  email: string;
  name: string;
  surname: string;
  phone: string;
  id: number;
  token: string;
  picture?: string | null;
  fromGoogle: boolean;
}