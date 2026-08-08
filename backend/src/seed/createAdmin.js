import dotenv from "dotenv";
import connectDatabase from "../config/db.js";
import { ensureDatabaseSchema } from "../db/schema.js";
import { ensureAdminUser } from "../services/adminService.js";

dotenv.config();

const createAdmin = async () => {
  await connectDatabase();
  await ensureDatabaseSchema();
  await ensureAdminUser();
  console.log("Admin seed completed");
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error("No se pudo crear el admin", error);
  process.exit(1);
});
