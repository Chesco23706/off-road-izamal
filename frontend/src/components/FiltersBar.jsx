import { Search, SlidersHorizontal } from "lucide-react";

const FiltersBar = ({ filters, onChange, onClear }) => (
  <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-4 shadow-panel">
    <div className="mb-4 flex items-center gap-2">
      <SlidersHorizontal className="h-4 w-4 text-brand-yellow" />
      <p className="font-display text-2xl uppercase tracking-wide text-white">Filtros de Ruta</p>
    </div>

    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      <label className="relative xl:col-span-2">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Buscar por cliente"
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
        />
      </label>

      <input
        type="date"
        value={filters.fecha}
        onChange={(event) => onChange("fecha", event.target.value)}
        className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
      />

      <select
        value={filters.status}
        onChange={(event) => onChange("status", event.target.value)}
        className="h-12 rounded-2xl border border-white/10 bg-zinc-900 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
      >
        <option value="">Todos los estados</option>
        <option value="Pagado">Pagado</option>
        <option value="Pendiente">Pendiente</option>
      </select>

      <select
        value={filters.order}
        onChange={(event) => onChange("order", event.target.value)}
        className="h-12 rounded-2xl border border-white/10 bg-zinc-900 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
      >
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>

      <div className="grid grid-cols-1 gap-3">
        <select
          value={filters.sortBy}
          onChange={(event) => onChange("sortBy", event.target.value)}
          className="h-12 rounded-2xl border border-white/10 bg-zinc-900 px-4 text-white outline-none transition focus:border-brand-yellow/50 focus:shadow-glow"
        >
          <option value="fecha">Fecha</option>
          <option value="hora">Hora</option>
          <option value="nombreCliente">Cliente</option>
          <option value="tipoTour">Tipo</option>
          <option value="status">Status</option>
        </select>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="rounded-2xl border border-brand-yellow/30 bg-brand-yellow px-4 font-semibold uppercase tracking-wide text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-glow"
      >
        Limpiar
      </button>
    </div>
  </div>
);

export default FiltersBar;
