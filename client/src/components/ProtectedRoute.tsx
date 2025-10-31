import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // If no token or user data, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Optional: Validate token format or expiry here
  try {
    JSON.parse(user); // Ensure user data is valid JSON
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;