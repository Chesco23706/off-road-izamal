import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, UserCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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
        setError("No se pudo conectar con la API. Revisa la configuración del sistema.");
      } else {
        setError("No se pudo iniciar sesión");
      }
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
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-brand-yellow/20 bg-zinc-950/85 shadow-panel lg:grid-cols-[1fr_0.95fr]"
      >
        <div className="flex flex-col justify-center border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-4">
            <img
              src="/logo.jpg"
              alt="Off Road Izamal"
              className="h-24 w-24 rounded-3xl border border-brand-yellow/30 bg-white/5 object-cover"
            />
            <div>
              <p className="font-display text-6xl uppercase text-brand-yellow">OffRoad Izamal</p>
              <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
                Sistema de reservaciones
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="font-display text-4xl uppercase text-white">Acceso del personal</p>
            <p className="mt-2 text-sm text-zinc-400">
              Ingresa con tu usuario y contraseña para administrar agenda, pagos y salidas.
            </p>
          </div>
        </div>

        <div className="p-8">
          <p className="font-display text-5xl uppercase text-brand-yellow">Iniciar sesión</p>
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
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
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
              {loading ? "Entrando..." : "Entrar al panel"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
