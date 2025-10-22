import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // role not allowed → redirect based on role
    if (user.role === "MAIN_ADMIN") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.role === "SUB_ADMIN") {
      return <Navigate to="/subadmin/dashboard" />;
    } else if (user.role === "INTERN") {
      return <Navigate to="/intern/dashboard" />;
    } else {
      return <Navigate to="/profile" />;
    }
  }

  return children;
}

export default PrivateRoute;
