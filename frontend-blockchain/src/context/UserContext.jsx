import { createContext, useContext, useState, useEffect } from "react";
import { USERS as initialUsers } from "../data/users";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load users from localStorage if they exist
    const saved = localStorage.getItem("users");

    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      // Otherwise use users from users.js (seed data)
      setUsers(initialUsers);
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  }, []);

  const persist = (list) => {
    setUsers(list);
    localStorage.setItem("users", JSON.stringify(list));
  };

  const addUser = (newUser) => {
    const user = { ...newUser, id: Date.now() };
    const updated = [...users, user];
    persist(updated);
  };

  const updateUser = (id, changes) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, ...changes } : u
    );
    persist(updated);
  };

  const deleteUser = (id) => {
    const updated = users.filter((u) => u.id !== id);
    persist(updated);
  };

  const findUser = (username, password) => {
    return users.find(
      (u) => u.username === username && u.password === password
    );
  };

  return (
    <UserContext.Provider
      value={{ users, addUser, updateUser, deleteUser, findUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUsers = () => useContext(UserContext);
