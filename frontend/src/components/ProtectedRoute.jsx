import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (role && payload.role !== role) {
      return <Navigate to="/" replace />; // redirect if role mismatch
    }
  } catch (err) {
    return <Navigate to="/login" replace />; // malformed token
  }

  return children;
};

export default ProtectedRoute;
