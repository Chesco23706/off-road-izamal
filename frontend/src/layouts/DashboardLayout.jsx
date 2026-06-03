import { BarChart3, ClipboardList, Home, LogOut, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Panel", icon: Home, roles: ["admin", "empleado", "agenda"] },
  { to: "/tours", label: "Tours", icon: ClipboardList, roles: ["admin", "empleado"] },
  { to: "/ingresos", label: "Ingresos", icon: BarChart3, roles: ["admin", "empleado"] },
];

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="absolute inset-0 bg-grit opacity-95" />
      <div className="relative z-10">
        <nav className="border-b border-white/10 bg-black/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Off Road Izamal"
                className="h-14 w-14 rounded-xl border border-brand-yellow/50 bg-white/5 object-cover"
              />
              <div>
                <p className="font-display text-3xl uppercase tracking-wider text-brand-yellow">
                  OffRoad Izamal
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Panel administrativo
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
              <div className="order-3 flex w-full flex-wrap gap-2 lg:order-none lg:w-auto">
                {navItems.filter((item) => item.roles.includes(user?.rol)).map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.to;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-wide transition lg:flex-none ${
                        active
                          ? "border-brand-yellow/40 bg-brand-yellow text-black shadow-glow"
                          : "border-white/10 bg-white/5 text-white hover:border-brand-yellow/30 hover:text-brand-yellow"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

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

        <main className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
