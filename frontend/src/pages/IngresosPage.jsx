import { ArrowLeft, CircleDollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import MonthlyEarningsSection from "../components/MonthlyEarningsSection.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

const IngresosPage = () => (
  <DashboardLayout>
    <section className="mb-6 rounded-2xl border border-white/10 bg-zinc-950/85 p-5 shadow-panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-brand-yellow/25 bg-brand-yellow/10 px-3 py-2 text-brand-yellow">
            <CircleDollarSign className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">Ingresos</span>
          </div>
          <p className="font-display text-5xl uppercase leading-none text-white">
            Desglose de ganancias
          </p>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Revisa ganancias mensuales, facturacion, pendientes y graficas por dia y tipo de tour.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-semibold uppercase tracking-wide text-white transition hover:border-brand-yellow/30 hover:text-brand-yellow"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel
        </Link>
      </div>
    </section>

    <MonthlyEarningsSection />
  </DashboardLayout>
);

export default IngresosPage;
