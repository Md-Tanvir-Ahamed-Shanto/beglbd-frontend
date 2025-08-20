import React, { createContext, useState, ReactNode } from "react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}
// git add .
// git commit -m "Your commit message"
// git push origin feature/Abu-Kalam
interface MyContextType {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

export const MyContext = createContext<MyContextType | undefined>(undefined);

interface MyContextProviderProps {
  children: ReactNode;
}

export const MyContextProvider: React.FC<MyContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  return (
    <MyContext.Provider value={{ user, setUser }}>
      {children}
    </MyContext.Provider>
  );
};
