import { LogOut, Mountain, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="absolute inset-0 bg-grit opacity-95" />
      <div className="relative z-10">
        <nav className="border-b border-white/10 bg-black/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <img
                src="/offroad-zamal-logo.svg"
                alt="Off Road Izamal"
                className="h-12 w-12 rounded-xl border border-brand-yellow/50 bg-white/5 p-1"
              />
              <div>
                <p className="font-display text-3xl uppercase tracking-wider text-brand-yellow">
                  OffRoad Izamal
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Agency Control Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-brand-yellow/20 bg-white/5 px-4 py-2 text-right sm:block">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Usuario</p>
                <p className="flex items-center justify-end gap-2 text-sm font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-brand-yellow" />
                  {user?.usuario} ({user?.rol})
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-yellow/30 bg-brand-yellow px-4 py-3 font-semibold uppercase tracking-wide text-black shadow-glow transition hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </div>
          </div>
        </nav>

        <header className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6">
          <div className="overflow-hidden rounded-[28px] border border-brand-yellow/20 bg-zinc-950/70 p-6 shadow-panel">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs uppercase tracking-[0.25em] text-brand-yellow">
                  <Mountain className="h-4 w-4" />
                  Tours ATV / Agenda / Control
                </p>
                <h1 className="font-display text-5xl uppercase leading-none text-white sm:text-6xl">
                  Domina la ruta.
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-zinc-300 sm:text-base">
                  Gestiona reservaciones, bloquea horarios repetidos y controla pagos desde un
                  panel inspirado en la energia extrema de Off Road Izamal.
                </p>
              </div>
              <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                <p className="font-display text-3xl uppercase tracking-wide text-brand-yellow">
                  Ready For Action
                </p>
                <p>Login seguro con JWT, roles de acceso y estado de pago en tiempo real.</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
