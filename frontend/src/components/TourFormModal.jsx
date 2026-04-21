import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import api from "../api/client.js";
import { currency } from "../utils/formatters.js";

const initialForm = {
  nombreCliente: "",
  fecha: "",
  hora: "",
  cantidadAtvs: 1,
  tipoTour: "city_tours",
  extra: "",
  abono: "",
  total: ""
};

const TourFormModal = ({ open, onClose, onSubmit, loading, initialValues }) => {
  const [form, setForm] = useState(initialForm);
  const [availability, setAvailability] = useState(null);
  const [availabilityError, setAvailabilityError] = useState("");

  useEffect(() => {
    if (initialValues) {
      setForm({
        nombreCliente: initialValues.nombreCliente,
        fecha: initialValues.fecha,
        hora: initialValues.hora,
        cantidadAtvs: initialValues.cantidadAtvs,
        tipoTour: initialValues.tipoTour,
        extra: initialValues.extra || "",
        abono: initialValues.abono,
        total: initialValues.total
      });
      return;
    }

    setForm(initialForm);
  }, [initialValues, open]);

  useEffect(() => {
    if (!open || !form.fecha || !form.hora) {
      setAvailability(null);
      setAvailabilityError("");
      return;
    }

    const timeout = window.setTimeout(async () => {
      try {
        setAvailabilityError("");
        const { data } = await api.get("/tours/availability", {
          params: {
            fecha: form.fecha,
            hora: form.hora,
            excludeTourId: initialValues?._id,
          },
        });
        setAvailability(data);
      } catch (requestError) {
        setAvailability(null);
        setAvailabilityError(
          requestError.response?.data?.message || "No se pudo consultar disponibilidad"
        );
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [form.fecha, form.hora, initialValues?._id, open]);

  const restante = useMemo(() => {
    const total = Number(form.total || 0);
    const abono = Number(form.abono || 0);
    return Math.max(total - abono, 0);
  }, [form.total, form.abono]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      cantidadAtvs: Number(form.cantidadAtvs),
      abono: Number(form.abono),
      total: Number(form.total)
    });
  };

  const requestedAtvs = Number(form.cantidadAtvs || 0);
  const exceedsAvailability = availability && requestedAtvs > availability.availableAtvs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[30px] border border-brand-yellow/20 bg-zinc-950 p-6 shadow-panel">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-display text-4xl uppercase text-brand-yellow">
              {initialValues ? "Editar Reservacion" : "Nueva Reservacion"}
            </p>
            <p className="text-sm text-zinc-400">
              Cada salida bloquea las cuatrimotos por 3 horas. Capacidad maxima: 10 ATVs.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-400 transition hover:border-brand-yellow/30 hover:text-brand-yellow"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            placeholder="Nombre del cliente"
            value={form.nombreCliente}
            onChange={(event) => handleChange("nombreCliente", event.target.value)}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow md:col-span-2"
            required
          />
          <input
            type="date"
            value={form.fecha}
            onChange={(event) => handleChange("fecha", event.target.value)}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
            required
          />
          <input
            type="time"
            value={form.hora}
            onChange={(event) => handleChange("hora", event.target.value)}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
            required
          />
          <input
            type="number"
            min="1"
            max="10"
            step="1"
            placeholder="Cantidad de ATVs"
            value={form.cantidadAtvs}
            onChange={(event) => handleChange("cantidadAtvs", event.target.value)}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
            required
          />
          {(availability || availabilityError) && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm md:col-span-2 ${
                exceedsAvailability || availabilityError
                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                  : "border-green-500/20 bg-green-500/10 text-green-300"
              }`}
            >
              {availabilityError ||
                `Disponibles para esa ventana de ${availability.blockHours} horas: ${availability.availableAtvs} de ${availability.capacity} ATVs.`}
              {exceedsAvailability &&
                ` La reservacion pide ${requestedAtvs}, supera la disponibilidad.`}
            </div>
          )}
          <select
            value={form.tipoTour}
            onChange={(event) => handleChange("tipoTour", event.target.value)}
            className="h-12 rounded-2xl border border-white/10 bg-zinc-900 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
          >
            <option value="city_tours">City Tours</option>
            <option value="tour_ebula">Tour Ebula/Sacala</option>
            <option value="tour_fogata">Tour con fogata</option>
            <option value="extra">Extra</option>
          </select>
          <input
            placeholder="Extra opcional o detalle adicional"
            value={form.extra}
            onChange={(event) => handleChange("extra", event.target.value)}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow md:col-span-2"
            required={form.tipoTour === "extra"}
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Abono"
            value={form.abono}
            onChange={(event) => handleChange("abono", event.target.value)}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Total"
            value={form.total}
            onChange={(event) => handleChange("total", event.target.value)}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
            required
          />
          <div className="rounded-2xl border border-brand-yellow/20 bg-brand-yellow/10 px-4 py-3 text-white md:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Saldo por pagar</p>
            <p className="font-display text-4xl uppercase text-brand-yellow">{currency(restante)}</p>
          </div>
          <button
            type="submit"
            disabled={loading || exceedsAvailability}
            className="h-12 rounded-2xl bg-brand-yellow font-semibold uppercase tracking-widest text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-glow disabled:opacity-60 md:col-span-2"
          >
            {loading ? "Guardando..." : initialValues ? "Actualizar" : "Crear Reservacion"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TourFormModal;
