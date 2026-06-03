import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-black text-brand-yellow">
        <p className="font-display text-4xl tracking-widest">CARGANDO PANEL...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
