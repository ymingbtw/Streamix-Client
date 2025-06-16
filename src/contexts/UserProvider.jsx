import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const UserContext = createContext({
  token: Cookies.get("auth_token"),
  authenticated: null,
});

export default function UserProvider({ children }) {
  const [token, setToken] = useState(Cookies.get("auth_token"));
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  return (
    <UserContext.Provider
      value={{ token, setToken, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </UserContext.Provider>
  );
}
export function useUserContext() {
  return useContext(UserContext);
}
