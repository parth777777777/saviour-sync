import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  if (adminOnly) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role !== "admin") return <Navigate to="/donors" replace />;
  }

  return children;
};

export default ProtectedRoute;
