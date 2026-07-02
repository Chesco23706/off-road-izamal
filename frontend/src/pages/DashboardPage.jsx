import { useState } from "react";
import { Bike, CalendarClock, Edit3, Map, Plus, ShieldCheck } from "lucide-react";
import api from "../api/client";
import TourFormModal from "../components/TourFormModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useTours from "../hooks/useTours.js";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { currency, prettyTourType } from "../utils/formatters.js";

const defaultFilters = {
  search: "",
  fecha: "",
  status: "",
  sortBy: "fecha",
  order: "asc",
  compact: "true",
  limit: 10,
};

const getToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
  }).format(new Date());

const sortBySchedule = (a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`);

const DashboardPage = () => {
  const { user } = useAuth();
  const canManageTours = user?.rol !== "agenda";
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const today = getToday();
  const tourFilters = {
    ...defaultFilters,
    fromDate: today,
    status: canManageTours ? "Pendiente" : "",
  };
  const { tours, loading, error, refresh } = useTours(tourFilters);
  const upcomingTours = tours
    .sort(sortBySchedule)
    .slice(0, 10);

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

  const markAsPaid = async (tour) => {
    try {
      await api.patch(`/tours/${tour._id}/pay`);
      showFeedback("success", `Reservacion de ${tour.nombreCliente} marcada como pagada.`);
      await refresh();
    } catch (requestError) {
      showFeedback("error", requestError.response?.data?.message || "No se pudo actualizar");
    }
  };

  return (
    <DashboardLayout>
      <section className="min-w-0">
          <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-950/85 p-5 shadow-panel">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-brand-yellow/25 bg-brand-yellow/10 px-3 py-2 text-brand-yellow">
                  <CalendarClock className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                    Menu principal
                  </span>
                </div>
                <p className="font-display text-5xl uppercase leading-none text-white">
                  {canManageTours ? "Pendientes proximos" : "Proximos tours"}
                </p>
                <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                  {canManageTours
                    ? "Lista enfocada en las reservaciones pendientes que vienen primero en la agenda."
                    : "Lista enfocada en las reservaciones que vienen primero en la agenda."}
                </p>
              </div>

              {canManageTours && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-yellow px-5 py-4 font-semibold uppercase tracking-wider text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-glow"
                >
                  <Plus className="h-5 w-5" />
                  Nueva reservacion
                </button>
              )}
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
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-12 text-center font-display text-4xl uppercase tracking-wide text-brand-yellow shadow-panel">
              Cargando pendientes...
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTours.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-10 text-center shadow-panel">
                  <Bike className="mx-auto mb-4 h-10 w-10 text-brand-yellow" />
                  <p className="font-display text-4xl uppercase text-white">
                    {canManageTours ? "Sin pendientes proximos" : "Sin proximos tours"}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    {canManageTours
                      ? "No hay reservaciones pendientes a partir de hoy."
                      : "No hay reservaciones a partir de hoy."}
                  </p>
                </div>
              ) : (
                upcomingTours.map((tour) => (
                  <article
                    key={tour._id}
                    className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-panel"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                              tour.status === "Pagado"
                                ? "border-green-500/20 bg-green-500/10 text-green-300"
                                : "border-red-500/20 bg-red-500/10 text-red-300"
                            }`}
                          >
                            {tour.status}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
                            <Map className="h-3.5 w-3.5 text-brand-yellow" />
                            {prettyTourType(tour.tipoTour)}
                          </span>
                        </div>

                        <p className="truncate font-display text-4xl uppercase leading-none text-white">
                          {tour.nombreCliente}
                        </p>
                        <div className="mt-3 grid gap-3 text-sm text-zinc-400 sm:grid-cols-4">
                          <p>
                            <span className="block text-xs uppercase tracking-[0.2em] text-zinc-600">
                              Fecha
                            </span>
                            {tour.fecha}
                          </p>
                          <p>
                            <span className="block text-xs uppercase tracking-[0.2em] text-zinc-600">
                              Hora
                            </span>
                            {tour.hora}
                          </p>
                          <p>
                            <span className="block text-xs uppercase tracking-[0.2em] text-zinc-600">
                              ATVs
                            </span>
                            {tour.cantidadAtvs}
                          </p>
                          {canManageTours && (
                            <p>
                              <span className="block text-xs uppercase tracking-[0.2em] text-zinc-600">
                                Saldo
                              </span>
                              {currency(tour.restante)}
                            </p>
                          )}
                        </div>
                      </div>

                      {canManageTours && (
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(tour)}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-zinc-200 transition hover:border-brand-yellow/30 hover:text-brand-yellow"
                          >
                            <Edit3 className="h-4 w-4" />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => markAsPaid(tour)}
                            className="inline-flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-green-300 transition hover:-translate-y-0.5"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            Pagado
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
      </section>

      {canManageTours && (
        <TourFormModal
          open={modalOpen}
          onClose={closeModal}
          onSubmit={submitTour}
          loading={formLoading}
          initialValues={selectedTour}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
