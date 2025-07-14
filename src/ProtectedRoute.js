import React, { useEffect, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [sessionExpired, setSessionExpired] = useState(false);
  const location = useLocation();

  
  useEffect(() => {
    const handleExpire = () => {
      setSessionExpired(true);
    };

    window.addEventListener("session-expired", handleExpire);
    return () => window.removeEventListener("session-expired", handleExpire);
  }, []);


  if (sessionExpired || (!loading && !user)) {
    return (
      <Navigate
        to="/login"
        state={{
          sessionExpired: true,
          message: "Your session has expired. Please log in again.",
          from: location.pathname,
        }}
        replace
      />
    );
  }


  if (loading) return <div>Loading...</div>;

  return children;
};

export default ProtectedRoute;
