import { createContext, useState, useContext, useEffect } from "react";
import { USERS } from "../data/users";
import { useUsers } from "./UserContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const { findUser } = useUsers();
  const [user, setUser] = useState(null);

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // ➜ login retourne l'utilisateur si OK, sinon null (pas d'exception)
  const login = (username, password) => {
    const found = findUser(username, password);

    if (!found) return null;

    const logged = {
      id: found.id,
      username: found.username,
      role: found.role,
    };

    setUser(logged);
    localStorage.setItem("user", JSON.stringify(logged));
    return logged;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
