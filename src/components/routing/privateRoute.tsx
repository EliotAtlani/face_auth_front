import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";

const PrivateRoute: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("AuthContext must be used within an AuthProvider");

  const { auth, isLoading } = authContext;

  if (isLoading) {
    // You can return a loading spinner or any other loading indicator here
    return <div>Loading...</div>;
  }

  return auth.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
