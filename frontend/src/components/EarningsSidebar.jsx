import { useEffect, useMemo, useState } from "react";
import { BarChart3, Calendar, CircleDollarSign, Clock3, TrendingUp, WalletCards } from "lucide-react";
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

const SidebarMetric = ({ icon: Icon, label, value, tone = "text-brand-yellow" }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      <Icon className={`h-4 w-4 ${tone}`} />
    </div>
    <p className="font-display text-3xl uppercase leading-none text-white">{value}</p>
  </div>
);

const MiniDailyChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.totalGanado), 1);

  return (
    <div className="flex h-24 items-end gap-1 rounded-xl border border-white/10 bg-black/30 p-3">
      {data.map((item) => {
        const height = `${Math.max((item.totalGanado / maxValue) * 100, item.totalGanado ? 8 : 2)}%`;

        return (
          <div key={item.date} className="flex min-w-0 flex-1 items-end">
            <div
              className={`w-full rounded-t-sm ${item.totalGanado ? "bg-brand-yellow" : "bg-white/10"}`}
              style={{ height }}
              title={`${item.date}: ${currency(item.totalGanado)}`}
            />
          </div>
        );
      })}
    </div>
  );
};

const EarningsSidebar = ({ dashboard }) => {
  const [month, setMonth] = useState(getCurrentMonth);
  const [monthly, setMonthly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchMonthly = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/dashboard/monthly-earnings", {
          params: { month },
        });

        if (!ignore) {
          setMonthly(data);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.response?.data?.message || "No se pudieron cargar los ingresos");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchMonthly();

    return () => {
      ignore = true;
    };
  }, [month]);

  const summary = monthly?.summary || {};
  const paidTours = useMemo(
    () => monthly?.byStatus?.find((item) => item.status === "Pagado")?.tours || 0,
    [monthly]
  );
  const pendingTours = useMemo(
    () => monthly?.byStatus?.find((item) => item.status === "Pendiente")?.tours || 0,
    [monthly]
  );

  return (
    <aside className="space-y-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
      <section className="rounded-2xl border border-white/10 bg-zinc-950/85 p-5 shadow-panel">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-4xl uppercase text-white">Ingresos</p>
            <p className="text-sm text-zinc-500">Resumen general</p>
          </div>
          <CircleDollarSign className="h-7 w-7 text-brand-yellow" />
        </div>

        <div className="grid gap-3">
          <SidebarMetric
            icon={CircleDollarSign}
            label="Total ganado"
            value={currency(dashboard?.totalGanado || 0)}
          />
          <div className="grid grid-cols-3 gap-3">
            <SidebarMetric icon={Calendar} label="Hoy" value={dashboard?.toursDelDia || 0} tone="text-white" />
            <SidebarMetric icon={Clock3} label="Pend." value={dashboard?.pendientes || 0} tone="text-red-400" />
            <SidebarMetric icon={BarChart3} label="Pag." value={dashboard?.pagados || 0} tone="text-green-400" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-950/85 p-5 shadow-panel">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-4xl uppercase text-white">Mensual</p>
            <p className="text-sm text-zinc-500">{monthly ? monthLabel(monthly.month) : "Selecciona mes"}</p>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
            <Calendar className="h-4 w-4 text-brand-yellow" />
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value || getCurrentMonth())}
              className="w-32 bg-transparent text-white outline-none"
            />
          </label>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center font-display text-2xl uppercase text-brand-yellow">
            Cargando ingresos...
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-3">
              <SidebarMetric icon={CircleDollarSign} label="Ganado" value={currency(summary.totalGanado)} />
              <SidebarMetric icon={WalletCards} label="Facturado" value={currency(summary.totalFacturado)} />
              <SidebarMetric icon={TrendingUp} label="Pendiente" value={currency(summary.totalPendiente)} />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-display text-3xl uppercase text-white">Por dia</p>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {summary.tours || 0} tours
                </p>
              </div>
              <MiniDailyChart data={monthly?.daily || []} />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-display text-3xl uppercase text-white">Estados</p>
                <p className="text-xs text-zinc-500">
                  {paidTours} pagados / {pendingTours} pendientes
                </p>
              </div>
              <div className="space-y-3">
                {(monthly?.byType || []).map((item) => {
                  const max = Math.max(...(monthly?.byType || []).map((type) => type.totalGanado), 1);
                  const width = `${Math.max((item.totalGanado / max) * 100, 5)}%`;

                  return (
                    <div key={item.tipoTour}>
                      <div className="mb-1 flex justify-between gap-3 text-sm">
                        <span className="text-zinc-300">{prettyTourType(item.tipoTour)}</span>
                        <span className="shrink-0 text-brand-yellow">{currency(item.totalGanado)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-brand-yellow" style={{ width }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </aside>
  );
};

export default EarningsSidebar;
