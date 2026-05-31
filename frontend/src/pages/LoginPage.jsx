import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarCheck2,
  Eye,
  EyeOff,
  LockKeyhole,
  Route,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const sections = [
  { href: "#operacion", label: "Operacion" },
  { href: "#control", label: "Control" },
  { href: "#reportes", label: "Reportes" },
];

const highlights = [
  {
    icon: CalendarCheck2,
    title: "Agenda",
    text: "Reservaciones, horarios y disponibilidad en una vista ordenada.",
  },
  {
    icon: Route,
    title: "Rutas",
    text: "Control de tours, clientes, ATVs y detalles operativos.",
  },
  {
    icon: BarChart3,
    title: "Ganancias",
    text: "Resumen de pagos, pendientes y rendimiento mensual.",
  },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      if (requestError.response?.data?.message) {
        setError(requestError.response.data.message);
      } else if (requestError.request) {
        setError("No se pudo conectar con la API. Revisa la configuracion del sistema.");
      } else {
        setError("No se pudo iniciar sesion");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="bg-grit">
        <header className="border-b border-white/10 bg-black/85 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Off Road Izamal"
                className="h-12 w-12 shrink-0 rounded-xl border border-brand-yellow/40 bg-white/5 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-display text-3xl uppercase tracking-wide text-brand-yellow">
                  OffRoad Izamal
                </p>
                <p className="truncate text-xs uppercase tracking-[0.28em] text-zinc-500">
                  Agency Control
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {sections.map((section) => (
                <a
                  key={section.href}
                  href={section.href}
                  className="rounded-xl px-4 py-2 text-sm font-semibold uppercase tracking-wide text-zinc-400 transition hover:bg-white/5 hover:text-brand-yellow"
                >
                  {section.label}
                </a>
              ))}
            </div>

            <a
              href="#login"
              className="shrink-0 rounded-xl bg-brand-yellow px-4 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-yellow-300 hover:shadow-glow"
            >
              Entrar
            </a>
          </nav>
        </header>

        <main>
          <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-2 text-brand-yellow">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em]">
                  Panel privado
                </span>
              </div>

              <h1 className="font-display text-6xl uppercase leading-none text-white sm:text-7xl lg:text-8xl">
                Control limpio para cada salida.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
                Administra reservaciones, pagos, disponibilidad y ganancias desde un panel
                operativo hecho para trabajar rapido y sin ruido visual.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.title} className="border-l border-brand-yellow/40 bg-black/25 p-4">
                    <item.icon className="mb-4 h-6 w-6 text-brand-yellow" />
                    <p className="font-display text-2xl uppercase text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.section
              id="login"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-2xl border border-white/10 bg-zinc-950/90 p-6 shadow-panel sm:p-8"
            >
              <div className="mb-7 border-b border-white/10 pb-5">
                <p className="font-display text-5xl uppercase text-brand-yellow">Iniciar sesion</p>
                <p className="mt-1 text-sm text-zinc-400">Acceso operativo para el equipo.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Usuario
                  </span>
                  <div className="flex h-14 items-center rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-brand-yellow/50 focus-within:shadow-glow">
                    <UserCircle2 className="mr-3 h-5 w-5 text-brand-yellow" />
                    <input
                      value={form.usuario}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, usuario: event.target.value }))
                      }
                      placeholder="admin"
                      className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Contrasena
                  </span>
                  <div className="flex h-14 items-center rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-brand-yellow/50 focus-within:shadow-glow">
                    <LockKeyhole className="mr-3 h-5 w-5 text-brand-yellow" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, password: event.target.value }))
                      }
                      placeholder="********"
                      className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="ml-3 rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-brand-yellow"
                      aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </label>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-xl bg-brand-yellow font-display text-3xl uppercase tracking-wider text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-glow disabled:opacity-60"
                >
                  {loading ? "Entrando..." : "Entrar al panel"}
                </button>
              </form>
            </motion.section>
          </section>
        </main>
      </div>

      <section id="operacion" className="border-y border-white/10 bg-zinc-950 px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-display text-5xl uppercase text-white">Operacion</p>
            <p className="mt-3 text-zinc-400">
              La informacion importante queda separada por flujo: agenda, pagos y rendimiento.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <item.icon className="mb-5 h-6 w-6 text-brand-yellow" />
                <p className="font-display text-3xl uppercase text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="control" className="bg-black px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="font-display text-5xl uppercase text-brand-yellow">Control</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
            <div className="rounded-xl border border-white/10 bg-zinc-950 p-5">
              <p className="font-display text-3xl uppercase text-white">Reservaciones</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Horarios, clientes, ATVs y estados de pago en una agenda central.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-950 p-5">
              <p className="font-display text-3xl uppercase text-white">Equipo</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Acceso con roles para separar operacion diaria y acciones administrativas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="reportes" className="border-t border-white/10 bg-zinc-950 px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-5xl uppercase text-white">Reportes</p>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Exportaciones y graficas mensuales para revisar ingresos, pendientes y actividad.
            </p>
          </div>
          <a
            href="#login"
            className="inline-flex items-center justify-center rounded-xl border border-brand-yellow/30 bg-brand-yellow px-5 py-4 font-semibold uppercase tracking-wide text-black transition hover:bg-yellow-300 hover:shadow-glow"
          >
            Acceder ahora
          </a>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
