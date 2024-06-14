import { createContext, useState, Dispatch, SetStateAction } from 'react';
import { UserInfoProps } from '../types/types';

interface AuthContextType {
  user: UserInfoProps | null;
  setUser: Dispatch<SetStateAction<UserInfoProps | null>>;
  updateUser: (updatedFields: Partial<UserInfoProps>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storedUser = localStorage.getItem('loggedUser');
  const newUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState<UserInfoProps | null>(newUser);

  const updateUser = (updatedFields: Partial<UserInfoProps>) => {
    setUser((currentUser) => {
      if (currentUser) {
        return { ...currentUser, ...updatedFields };
      }
      return null;
    });
  };

  return <AuthContext.Provider value={{ user, setUser, updateUser }}>{children}</AuthContext.Provider>;
}
