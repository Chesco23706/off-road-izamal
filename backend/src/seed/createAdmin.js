import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDatabase from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  await connectDatabase();

  const usuario = process.env.ADMIN_USER || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const rol = process.env.ADMIN_ROLE || "admin";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await User.findOne({ usuario });

  if (existingUser) {
    existingUser.password = hashedPassword;
    existingUser.contraseña = undefined;
    existingUser["contraseÃ±a"] = undefined;
    existingUser.rol = rol;
    await existingUser.save();
    console.log(`Usuario ${usuario} actualizado correctamente`);
    process.exit(0);
  }

  await User.create({
    usuario,
    password: hashedPassword,
    rol,
  });

  console.log(`Usuario ${usuario} creado correctamente`);
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error("No se pudo crear el admin", error);
  process.exit(1);
});
