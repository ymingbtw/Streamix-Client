import { Navigate } from "react-router-dom";
import axios from "axios";

import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/UserProvider";

export default function ProtectedRoute({ children }) {
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
      const res = await axios.get(
        "https://api.ecnet.website/api/authenticate",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
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
  if (isAuthenticated || role == "user" || role == "admin") {
    return children;
  }
  return <Navigate to="/signin" replace />;
}
