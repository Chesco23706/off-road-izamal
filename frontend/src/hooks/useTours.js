import { useEffect, useState } from "react";
import api from "../api/client";

const useTours = (filters) => {
  const [tours, setTours] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        search: filters.search || undefined,
        fecha: filters.fecha || undefined,
        status: filters.status || undefined,
        sortBy: filters.sortBy,
        order: filters.order
      };

      const [toursResponse, dashboardResponse] = await Promise.all([
        api.get("/tours", { params }),
        api.get("/dashboard/summary")
      ]);

      setTours(toursResponse.data);
      setDashboard(dashboardResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo cargar la informacion");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.search, filters.fecha, filters.status, filters.sortBy, filters.order]);

  return {
    tours,
    dashboard,
    loading,
    error,
    refresh: fetchData
  };
};

export default useTours;
