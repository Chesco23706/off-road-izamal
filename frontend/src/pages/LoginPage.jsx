import { useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, Mountain, UserCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ usuario: "", contraseña: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-black px-4 py-10 text-white">
      <div className="absolute inset-0 bg-grit opacity-95" />
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-yellow/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand-yellow/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-brand-yellow/20 bg-zinc-950/85 shadow-panel lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="flex flex-col justify-between border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <img
                src="/offroad-zamal-logo.svg"
                alt="Off Road Izamal"
                className="h-16 w-16 rounded-2xl border border-brand-yellow/30 bg-white/5 p-2"
              />
              <div>
                <p className="font-display text-5xl uppercase text-brand-yellow">OffRoad Izamal</p>
                <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">ATV Agency</p>
              </div>
            </div>

            <h1 className="max-w-lg font-display text-6xl uppercase leading-none text-white">
              Control brutal para aventuras reales.
            </h1>
            <p className="mt-4 max-w-lg text-zinc-300">
              Administra reservas, pagos y operaciones diarias desde un panel con caracter
              extremo, inspirado en rutas, tierra y velocidad.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <Mountain className="mb-3 h-6 w-6 text-brand-yellow" />
              <p className="font-display text-3xl uppercase text-white">Dashboard de ruta</p>
              <p className="text-sm text-zinc-400">Tours del dia, ingresos y pendientes al instante.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <LockKeyhole className="mb-3 h-6 w-6 text-brand-yellow" />
              <p className="font-display text-3xl uppercase text-white">Acceso blindado</p>
              <p className="text-sm text-zinc-400">JWT, bcrypt y roles admin / empleado.</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <p className="font-display text-5xl uppercase text-brand-yellow">Iniciar Sesion</p>
          <p className="mb-6 mt-2 text-zinc-400">Acceso privado para el equipo operativo.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-zinc-500">
                Usuario
              </span>
              <div className="flex h-14 items-center rounded-2xl border border-white/10 bg-white/5 px-4 transition focus-within:border-brand-yellow/50 focus-within:shadow-glow">
                <UserCircle2 className="mr-3 h-5 w-5 text-brand-yellow" />
                <input
                  value={form.usuario}
                  onChange={(event) => setForm((current) => ({ ...current, usuario: event.target.value }))}
                  placeholder="admin"
                  className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-zinc-500">
                Contraseña
              </span>
              <div className="flex h-14 items-center rounded-2xl border border-white/10 bg-white/5 px-4 transition focus-within:border-brand-yellow/50 focus-within:shadow-glow">
                <LockKeyhole className="mr-3 h-5 w-5 text-brand-yellow" />
                <input
                  type="password"
                  value={form.contraseña}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, contraseña: event.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
                  required
                />
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-brand-yellow font-display text-3xl uppercase tracking-wider text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-glow disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar al Panel"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
