import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByUsername,
  updateUser,
} from "../repositories/userRepository.js";

const upsertUser = async ({ usuario, password, rol, sync, label }) => {
  const existingUser = await findUserByUsername(usuario);

  if (existingUser) {
    if (sync) {
      await updateUser(existingUser.id, {
        password: await bcrypt.hash(password, 10),
        rol,
      });
      console.log(`${label} user ${usuario} updated`);
      return;
    }

    console.log(`${label} user ${usuario} already exists`);
    return;
  }

  await createUser({
    usuario,
    password: await bcrypt.hash(password, 10),
    rol,
  });

  console.log(`${label} user ${usuario} created`);
};

export const ensureAdminUser = async () => {
  const usuario = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  const rol = process.env.ADMIN_ROLE || "admin";

  if (!usuario || !password) {
    console.log("Admin seed skipped: ADMIN_USER or ADMIN_PASSWORD is missing");
    return;
  }

  await upsertUser({
    usuario,
    password,
    rol,
    sync: process.env.ADMIN_SYNC === "true",
    label: "Admin",
  });
};

export const ensureAgendaUser = async () => {
  const usuario = process.env.AGENDA_USER || "Julio";
  const password = process.env.AGENDA_PASSWORD || "Julio123!";
  const rol = "agenda";

  await upsertUser({
    usuario,
    password,
    rol,
    sync: process.env.AGENDA_SYNC !== "false",
    label: "Agenda",
  });
};
