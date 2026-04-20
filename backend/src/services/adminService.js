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

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({ usuario });

  if (existingUser) {
    existingUser.password = hashedPassword;
    existingUser.contraseña = undefined;
    existingUser[legacyMojibakePasswordKey] = undefined;
    existingUser.rol = rol;
    await existingUser.save();
    console.log(`Admin user ${usuario} updated`);
    return;
  }

  await User.create({
    usuario,
    password: hashedPassword,
    rol,
  });

  console.log(`Admin user ${usuario} created`);
};
