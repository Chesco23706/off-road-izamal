import { useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import api from "../api/client";
import FiltersBar from "../components/FiltersBar.jsx";
import TourFormModal from "../components/TourFormModal.jsx";
import ToursTable from "../components/ToursTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useTours from "../hooks/useTours.js";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

const defaultFilters = {
  search: "",
  fecha: "",
  status: "",
  sortBy: "fecha",
  order: "asc",
  compact: "true",
};

const RegistroToursPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const { tours, loading, error, refresh } = useTours(filters);

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
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

  const getExportParams = () => ({
    search: filters.search || undefined,
    fecha: filters.fecha || undefined,
    status: filters.status || undefined,
    sortBy: filters.sortBy,
    order: filters.order,
  });

  const downloadFile = async (path, filename) => {
    const response = await api.get(path, {
      params: getExportParams(),
      responseType: "blob",
    });
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
      <section className="mb-6 rounded-2xl border border-white/10 bg-zinc-950/85 p-5 shadow-panel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-brand-yellow/25 bg-brand-yellow/10 px-3 py-2 text-brand-yellow">
              <ClipboardList className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                Registro de tours
              </span>
            </div>
            <p className="font-display text-5xl uppercase leading-none text-white">Todos los tours</p>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Consulta, filtra, exporta y administra todas las reservaciones.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-yellow px-5 py-4 font-semibold uppercase tracking-wider text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-glow"
          >
            <Plus className="h-5 w-5" />
            Nueva reservacion
          </button>
        </div>

        {(error || feedback.message) && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              feedback.type === "error" || error
                ? "border-red-500/20 bg-red-500/10 text-red-300"
                : "border-green-500/20 bg-green-500/10 text-green-300"
            }`}
          >
            {error || feedback.message}
          </div>
        )}
      </section>

      <section className="mb-6">
        <FiltersBar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
      </section>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-12 text-center font-display text-4xl uppercase tracking-wide text-brand-yellow shadow-panel">
          Cargando tours...
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

export default RegistroToursPage;
