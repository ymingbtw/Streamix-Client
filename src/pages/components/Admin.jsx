import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/UserProvider";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function Admin({ children }) {
  const {
    token,
    isAuthenticated,
    setToken,
    setIsAuthenticated,
    role,
    setRole,
  } = useUserContext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function authenticate() {
      const res = await axios.get("https://api.ecnet.space/api/authenticate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setRole(res.data.role);
      setIsAuthenticated(res.data.isAuthenticated);
      setToken(res.data.token);
      setLoading(false);
    }
    authenticate();
  }, []);
  if (loading) {
    return null;
  }
  if (!isAuthenticated || role != "admin") {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
