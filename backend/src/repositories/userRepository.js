import { randomUUID } from "node:crypto";
import { query } from "../config/db.js";

const toUser = (row) =>
  row
    ? {
        _id: row.id,
        id: row.id,
        usuario: row.usuario,
        password: row.password,
        rol: row.rol,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null;

export const findUserByUsername = async (usuario) => {
  const { rows } = await query("select * from offroad_users where usuario = $1 limit 1", [usuario]);
  return toUser(rows[0]);
};

export const createUser = async ({ id = randomUUID(), usuario, password, rol }) => {
  const { rows } = await query(
    `
      insert into offroad_users (id, usuario, password, rol)
      values ($1, $2, $3, $4)
      returning *
    `,
    [id, usuario, password, rol]
  );

  return toUser(rows[0]);
};

export const updateUser = async (id, { password, rol }) => {
  const { rows } = await query(
    `
      update offroad_users
      set password = coalesce($2, password),
          rol = coalesce($3, rol),
          updated_at = now()
      where id = $1
      returning *
    `,
    [id, password, rol]
  );

  return toUser(rows[0]);
};
