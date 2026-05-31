import bcrypt from "bcryptjs";
import User from "../models/User.js";

const legacyMojibakePasswordKey = "contrase" + String.fromCharCode(195, 177) + "a";

export const ensureAdminUser = async () => {
  const usuario = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  const rol = process.env.ADMIN_ROLE || "admin";

  if (!usuario || !password) {
    console.log("Admin seed skipped: ADMIN_USER or ADMIN_PASSWORD is missing");
    return;
  }

  const existingUser = await User.findOne({ usuario });

  if (existingUser) {
    if (process.env.ADMIN_SYNC === "true") {
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser[legacyMojibakePasswordKey] = undefined;
      existingUser.rol = rol;
      await existingUser.save();
      console.log(`Admin user ${usuario} updated`);
      return;
    }

    console.log(`Admin user ${usuario} already exists`);
    return;
  }

  await User.create({
    usuario,
    password: await bcrypt.hash(password, 10),
    rol,
  });

  console.log(`Admin user ${usuario} created`);
};
