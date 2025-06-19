import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [token, setToken] = useState(Cookies.get("auth_token"));
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  console.log("UserProvider token:", token);
  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated,
        setIsAuthenticated,
        role,
        setRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export function useUserContext() {
  return useContext(UserContext);
}
