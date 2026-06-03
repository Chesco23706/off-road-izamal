import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import IngresosPage from "./pages/IngresosPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegistroToursPage from "./pages/RegistroToursPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ingresos"
        element={
          <ProtectedRoute allowedRoles={["admin", "empleado"]}>
            <IngresosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tours"
        element={
          <ProtectedRoute allowedRoles={["admin", "empleado"]}>
            <RegistroToursPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
