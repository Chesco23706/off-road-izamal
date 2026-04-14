import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDatabase from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  await connectDatabase();

  const usuario = process.env.ADMIN_USER || "admin";
  const contraseña = process.env.ADMIN_PASSWORD || "Admin123!";
  const rol = process.env.ADMIN_ROLE || "admin";

  const existingUser = await User.findOne({ usuario });

  if (existingUser) {
    console.log("El usuario admin ya existe");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(contraseña, 10);

  await User.create({
    usuario,
    contraseña: hashedPassword,
    rol,
  });

  console.log(`Usuario ${usuario} creado correctamente`);
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error("No se pudo crear el admin", error);
  process.exit(1);
});
