import bcrypt from "bcryptjs";
import User from "../models/User.js";

const legacyMojibakePasswordKey = "contrase" + String.fromCharCode(195, 177) + "a";

const upsertUser = async ({ usuario, password, rol, sync, label }) => {
  const existingUser = await User.findOne({ usuario });

  if (existingUser) {
    if (sync) {
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser[legacyMojibakePasswordKey] = undefined;
      existingUser.rol = rol;
      await existingUser.save();
      console.log(`${label} user ${usuario} updated`);
      return;
    }

    console.log(`${label} user ${usuario} already exists`);
    return;
  }

  await User.create({
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
