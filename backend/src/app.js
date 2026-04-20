import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(",") : []),
]
  .map((origin) => origin?.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  try {
    const { hostname } = new URL(origin);
    return allowedOrigins.includes(origin) || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Off Road Izamal API activa" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/export", exportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
