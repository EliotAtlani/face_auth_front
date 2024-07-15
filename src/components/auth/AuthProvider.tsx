import { createContext, useState, useEffect, ReactNode, FC } from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  auth: { token: string | null; user: User | null };
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<{ token: string | null; user: User | null }>(
    {
      token: null,
      user: null,
    }
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setAuth({ token: storedToken, user: JSON.parse(storedUser) });
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
