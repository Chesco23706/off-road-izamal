import { useState } from "react";
import { Bike, CircleDollarSign, Mountain, Plus, Route } from "lucide-react";
import api from "../api/client";
import FiltersBar from "../components/FiltersBar.jsx";
import StatsCard from "../components/StatsCard.jsx";
import TourFormModal from "../components/TourFormModal.jsx";
import ToursTable from "../components/ToursTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useTours from "../hooks/useTours.js";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { currency } from "../utils/formatters.js";

const defaultFilters = {
  search: "",
  fecha: "",
  status: "",
  sortBy: "fecha",
  order: "asc"
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const { tours, dashboard, loading, error, refresh } = useTours(filters);

  const cards = [
    {
      label: "Total ganado",
      value: currency(dashboard?.totalGanado || 0),
      icon: CircleDollarSign,
      accent: "text-brand-yellow"
    },
    {
      label: "Tours del dia",
      value: dashboard?.toursDelDia || 0,
      icon: Bike,
      accent: "text-white"
    },
    {
      label: "Pendientes",
      value: dashboard?.pendientes || 0,
      icon: Route,
      accent: "text-red-400"
    },
    {
      label: "Pagados",
      value: dashboard?.pagados || 0,
      icon: Mountain,
      accent: "text-green-400"
    }
  ];

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value
    }));
  };

  const clearFilters = () => setFilters(defaultFilters);

  const openCreateModal = () => {
    setSelectedTour(null);
    setModalOpen(true);
  };

  const openEditModal = (tour) => {
    setSelectedTour(tour);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTour(null);
    setModalOpen(false);
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3500);
  };

  const submitTour = async (payload) => {
    try {
      setFormLoading(true);

      if (selectedTour) {
        await api.put(`/tours/${selectedTour._id}`, payload);
        showFeedback("success", "Reservacion actualizada correctamente.");
      } else {
        await api.post("/tours", payload);
        showFeedback("success", "Reservacion creada correctamente.");
      }

      closeModal();
      await refresh();
    } catch (requestError) {
      showFeedback("error", requestError.response?.data?.message || "No se pudo guardar");
    } finally {
      setFormLoading(false);
    }
  };

  const deleteTour = async (tour) => {
    const confirmed = window.confirm(`Eliminar la reservacion de ${tour.nombreCliente}?`);

    if (!confirmed) return;

    try {
      await api.delete(`/tours/${tour._id}`);
      showFeedback("success", "Reservacion eliminada.");
      await refresh();
    } catch (requestError) {
      showFeedback("error", requestError.response?.data?.message || "No se pudo eliminar");
    }
  };

  const markAsPaid = async (tour) => {
    try {
      await api.patch(`/tours/${tour._id}/pay`);
      showFeedback("success", `Reservacion de ${tour.nombreCliente} marcada como pagada.`);
      await refresh();
    } catch (requestError) {
      showFeedback("error", requestError.response?.data?.message || "No se pudo actualizar");
    }
  };

  const downloadFile = async (path, filename) => {
    const response = await api.get(path, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const exportExcel = async () => {
    try {
      await downloadFile("/export/excel", "off-road-izamal-reservaciones.xlsx");
    } catch {
      showFeedback("error", "No se pudo exportar a Excel");
    }
  };

  const exportPdf = async () => {
    try {
      await downloadFile("/export/pdf", "off-road-izamal-reservaciones.pdf");
    } catch {
      showFeedback("error", "No se pudo exportar a PDF");
    }
  };

  return (
    <DashboardLayout>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </section>

      <section className="mt-6">
        <FiltersBar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
      </section>

      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {(error || feedback.message) && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  feedback.type === "error" || error
                    ? "border-red-500/20 bg-red-500/10 text-red-300"
                    : "border-green-500/20 bg-green-500/10 text-green-300"
                }`}
              >
                {error || feedback.message}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-yellow px-5 py-4 font-semibold uppercase tracking-wider text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-glow"
          >
            <Plus className="h-5 w-5" />
            Nueva reservacion
          </button>
        </div>

        {loading ? (
          <div className="rounded-[30px] border border-white/10 bg-zinc-950/80 p-12 text-center font-display text-4xl uppercase tracking-wide text-brand-yellow shadow-panel">
            Cargando agenda...
          </div>
        ) : (
          <ToursTable
            tours={tours}
            onEdit={openEditModal}
            onDelete={deleteTour}
            onMarkPaid={markAsPaid}
            canDelete={user?.rol === "admin"}
            onExportExcel={exportExcel}
            onExportPdf={exportPdf}
          />
        )}
      </section>

      <TourFormModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={submitTour}
        loading={formLoading}
        initialValues={selectedTour}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
