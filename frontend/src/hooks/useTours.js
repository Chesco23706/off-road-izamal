import { useEffect, useState } from "react";
import api from "../api/client";

const useTours = (filters, options = {}) => {
  const { includeDashboard = false } = options;
  const [tours, setTours] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getParams = () => ({
    search: filters.search || undefined,
    fecha: filters.fecha || undefined,
    status: filters.status || undefined,
    sortBy: filters.sortBy,
    order: filters.order
  });

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError("");

      const toursResponse = await api.get("/tours", { params: getParams() });
      setTours(toursResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo cargar la informacion");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    const dashboardResponse = await api.get("/dashboard/summary");
    setDashboard(dashboardResponse.data);
  };

  const refresh = async () => {
    try {
      setLoading(true);
      setError("");

      const [toursResponse, dashboardResponse] = await Promise.all([
        api.get("/tours", { params: getParams() }),
        includeDashboard ? api.get("/dashboard/summary") : Promise.resolve({ data: dashboard })
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
    fetchTours();
  }, [filters.search, filters.fecha, filters.status, filters.sortBy, filters.order]);

  useEffect(() => {
    if (!includeDashboard) return;

    fetchDashboard().catch((requestError) => {
      setError(requestError.response?.data?.message || "No se pudo cargar el resumen");
    });
  }, [includeDashboard]);

  return {
    tours,
    dashboard,
    loading,
    error,
    refresh
  };
};

export default useTours;
