import { useEffect, useMemo, useState } from "react";
import { BarChart3, Calendar, CircleDollarSign, TrendingUp, WalletCards } from "lucide-react";
import api from "../api/client.js";
import { currency, prettyTourType } from "../utils/formatters.js";

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const monthLabel = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthNumber - 1, 1));
};

const MonthlyStat = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow/15 text-brand-yellow">
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{label}</p>
    <p className="mt-1 font-display text-3xl uppercase text-white">{value}</p>
  </div>
);

const DailyEarningsChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.totalGanado), 1);
  const chartHeight = 180;
  const chartWidth = Math.max(data.length * 26, 620);

  return (
    <div className="overflow-x-auto">
      <svg
        role="img"
        aria-label="Grafica de ganancias diarias"
        viewBox={`0 0 ${chartWidth} 240`}
        className="h-64 min-w-full"
      >
        <line x1="0" y1="190" x2={chartWidth} y2="190" stroke="rgba(255,255,255,0.16)" />
        {data.map((item, index) => {
          const barHeight = Math.max((item.totalGanado / maxValue) * chartHeight, item.totalGanado ? 8 : 0);
          const x = index * 26 + 6;
          const y = 190 - barHeight;

          return (
            <g key={item.date}>
              <rect
                x={x}
                y={y}
                width="14"
                height={barHeight}
                rx="4"
                className="fill-brand-yellow"
              />
              {(item.day === 1 || item.day % 5 === 0 || item.day === data.length) && (
                <text x={x + 7} y="214" textAnchor="middle" className="fill-zinc-500 text-[11px]">
                  {item.day}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const TourTypeChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.totalGanado), 1);

  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-zinc-500">Sin ganancias registradas en este mes.</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const width = `${Math.max((item.totalGanado / maxValue) * 100, 4)}%`;

        return (
          <div key={item.tipoTour}>
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-white">{prettyTourType(item.tipoTour)}</span>
              <span className="shrink-0 text-zinc-400">{currency(item.totalGanado)}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-brand-yellow" style={{ width }} />
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">{item.tours} tours</p>
          </div>
        );
      })}
    </div>
  );
};

const MonthlyEarningsSection = () => {
  const [month, setMonth] = useState(getCurrentMonth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchMonthlyEarnings = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/dashboard/monthly-earnings", {
          params: { month },
        });

        if (!ignore) {
          setData(response.data);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.response?.data?.message || "No se pudieron cargar las ganancias");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchMonthlyEarnings();

    return () => {
      ignore = true;
    };
  }, [month]);

  const summary = data?.summary || {};
  const paidStatus = useMemo(
    () => data?.byStatus?.find((item) => item.status === "Pagado") || { tours: 0, totalGanado: 0 },
    [data]
  );

  return (
    <section className="mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-zinc-950/80 shadow-panel">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-4xl uppercase tracking-wide text-white">Ganancias mensuales</p>
          <p className="text-sm text-zinc-400">
            {data ? monthLabel(data.month) : "Selecciona un mes para ver el rendimiento."}
          </p>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
          <Calendar className="h-5 w-5 text-brand-yellow" />
          <input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value || getCurrentMonth())}
            className="bg-transparent text-white outline-none"
          />
        </label>
      </div>

      <div className="p-5">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center font-display text-3xl uppercase tracking-wide text-brand-yellow">
            Cargando ganancias...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MonthlyStat icon={CircleDollarSign} label="Ganado" value={currency(summary.totalGanado)} />
              <MonthlyStat icon={WalletCards} label="Facturado" value={currency(summary.totalFacturado)} />
              <MonthlyStat icon={TrendingUp} label="Pendiente" value={currency(summary.totalPendiente)} />
              <MonthlyStat icon={BarChart3} label="Tours pagados" value={paidStatus.tours} />
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl uppercase text-white">Por dia</p>
                    <p className="text-sm text-zinc-500">{summary.tours || 0} tours en el mes</p>
                  </div>
                  <p className="text-sm font-semibold text-brand-yellow">{summary.atvs || 0} ATVs</p>
                </div>
                <DailyEarningsChart data={data?.daily || []} />
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="mb-5">
                  <p className="font-display text-3xl uppercase text-white">Por tipo de tour</p>
                  <p className="text-sm text-zinc-500">Distribucion de ingresos cobrados</p>
                </div>
                <TourTypeChart data={data?.byType || []} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MonthlyEarningsSection;
