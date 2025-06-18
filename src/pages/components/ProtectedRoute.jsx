import { Navigate } from "react-router-dom";
import axios from "axios";

import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/UserProvider";

export default function ProtectedRoute({ children }) {
  console.log("protected route rendered");
  const { token, isAuthenticated, setToken, setIsAuthenticated } =
    useUserContext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function authenticate() {
      const res = await axios.get("http://ecnet.website/api/authenticate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log(res.data);
      setIsAuthenticated(res.data.isAuthenticated);
      setToken(res.data.token);
      setLoading(false);
    }
    authenticate();
  }, []);
  if (loading) {
    return null;
  }
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
