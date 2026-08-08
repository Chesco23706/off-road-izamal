import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase, { getPool, query } from "../config/db.js";
import { ensureDatabaseSchema } from "../db/schema.js";
import Tour from "../models/Tour.js";
import User from "../models/User.js";

dotenv.config();

const legacyMojibakePasswordKey = "contrase" + String.fromCharCode(195, 177) + "a";

const toDateString = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
};

const toTimeString = (value) => (value ? String(value).slice(0, 5) : null);

const migrateUsers = async () => {
  const users = await User.find().lean();

  for (const user of users) {
    const password = user.password || user.contraseña || user[legacyMojibakePasswordKey] || null;

    await query(
      `
        insert into offroad_users (id, usuario, password, rol, created_at, updated_at)
        values ($1, $2, $3, $4, coalesce($5, now()), coalesce($6, now()))
        on conflict (id) do update
        set usuario = excluded.usuario,
            password = excluded.password,
            rol = excluded.rol,
            updated_at = excluded.updated_at
      `,
      [
        String(user._id),
        user.usuario,
        password,
        user.rol || "empleado",
        user.createdAt || null,
        user.updatedAt || null,
      ]
    );
  }

  return users.length;
};

const migrateTours = async () => {
  const [tours, users] = await Promise.all([Tour.find().lean(), User.find().select("_id").lean()]);
  const userIds = new Set(users.map((user) => String(user._id)));

  for (const tour of tours) {
    const createdBy = tour.createdBy ? String(tour.createdBy) : null;

    await query(
      `
        insert into tours (
          id, nombre_cliente, fecha, hora, cantidad_atvs, tipo_tour, extra,
          abono, total, restante, status, created_by, created_at, updated_at
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, coalesce($13, now()), coalesce($14, now()))
        on conflict (id) do update
        set nombre_cliente = excluded.nombre_cliente,
            fecha = excluded.fecha,
            hora = excluded.hora,
            cantidad_atvs = excluded.cantidad_atvs,
            tipo_tour = excluded.tipo_tour,
            extra = excluded.extra,
            abono = excluded.abono,
            total = excluded.total,
            restante = excluded.restante,
            status = excluded.status,
            created_by = excluded.created_by,
            updated_at = excluded.updated_at
      `,
      [
        String(tour._id),
        tour.nombreCliente,
        toDateString(tour.fecha),
        toTimeString(tour.hora),
        Number(tour.cantidadAtvs || 0),
        tour.tipoTour,
        tour.extra || "",
        Number(tour.abono || 0),
        Number(tour.total || 0),
        Number(tour.restante || 0),
        tour.status,
        createdBy && userIds.has(createdBy) ? createdBy : null,
        tour.createdAt || null,
        tour.updatedAt || null,
      ]
    );
  }

  return tours.length;
};

const migrate = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to read current data");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  await connectDatabase();
  await ensureDatabaseSchema();

  const userCount = await migrateUsers();
  const tourCount = await migrateTours();

  console.log(`Migrated ${userCount} users and ${tourCount} tours to Supabase Postgres`);

  await mongoose.disconnect();
  await getPool().end();
};

migrate().catch(async (error) => {
  console.error("Migration failed", error);
  await mongoose.disconnect().catch(() => {});
  await getPool().end().catch(() => {});
  process.exit(1);
});
