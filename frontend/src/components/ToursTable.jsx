import { Bike, FileDown, Map, Pencil, ShieldAlert, Trash2 } from "lucide-react";
import { currency, prettyTourType } from "../utils/formatters.js";

const statusClasses = {
  Pagado: "bg-green-500/15 text-green-400 border-green-500/30",
  Pendiente: "bg-red-500/15 text-red-400 border-red-500/30"
};

const ToursTable = ({
  tours,
  onEdit,
  onDelete,
  onMarkPaid,
  canDelete,
  onExportExcel,
  onExportPdf
}) => (
  <div className="overflow-hidden rounded-[30px] border border-white/10 bg-zinc-950/80 shadow-panel">
    <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="font-display text-4xl uppercase tracking-wide text-white">Agenda de Tours</p>
        <p className="text-sm text-zinc-400">
          Tabla de control con pagos, horarios y bloqueo de ATVs por ventanas de 3 horas.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onExportExcel}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-brand-yellow/30 hover:text-brand-yellow"
        >
          <FileDown className="h-4 w-4" />
          Excel
        </button>
        <button
          type="button"
          onClick={onExportPdf}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-brand-yellow/30 hover:text-brand-yellow"
        >
          <FileDown className="h-4 w-4" />
          PDF
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-brand-yellow text-black">
          <tr className="font-display text-xl uppercase tracking-wide">
            <th className="px-4 py-4">Cliente</th>
            <th className="px-4 py-4">Fecha</th>
            <th className="px-4 py-4">Hora</th>
            <th className="px-4 py-4">ATVs</th>
            <th className="px-4 py-4">Tour</th>
            <th className="px-4 py-4">Extra</th>
            <th className="px-4 py-4">Abono</th>
            <th className="px-4 py-4">Total</th>
            <th className="px-4 py-4">Saldo</th>
            <th className="px-4 py-4">Estado</th>
            <th className="px-4 py-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tours.length === 0 ? (
            <tr>
              <td colSpan="11" className="px-4 py-10 text-center text-zinc-400">
                No hay reservaciones para los filtros seleccionados.
              </td>
            </tr>
          ) : (
            tours.map((tour) => (
              <tr key={tour._id} className="border-t border-white/10 text-zinc-200">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-brand-yellow/15 p-2 text-brand-yellow">
                      <Bike className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{tour.nombreCliente}</p>
                      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Reservación</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">{tour.fecha}</td>
                <td className="px-4 py-4">{tour.hora}</td>
                <td className="px-4 py-4 font-semibold text-brand-yellow">{tour.cantidadAtvs}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-300">
                    <Map className="h-3.5 w-3.5 text-brand-yellow" />
                    {prettyTourType(tour.tipoTour)}
                  </span>
                </td>
                <td className="px-4 py-4 text-zinc-300">{tour.extra || "-"}</td>
                <td className="px-4 py-4">{currency(tour.abono)}</td>
                <td className="px-4 py-4">{currency(tour.total)}</td>
                <td className="px-4 py-4">{currency(tour.restante)}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${statusClasses[tour.status]}`}
                  >
                    {tour.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(tour)}
                      className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:border-brand-yellow/30 hover:text-brand-yellow"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {tour.status !== "Pagado" && (
                      <button
                        type="button"
                        onClick={() => onMarkPaid(tour)}
                        className="rounded-xl border border-green-500/20 bg-green-500/10 p-2 text-green-400 transition hover:-translate-y-0.5"
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(tour)}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:-translate-y-0.5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default ToursTable;
