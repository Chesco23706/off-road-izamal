import app from "./app.js";
import connectDatabase from "./config/db.js";
import { ensureDatabaseSchema } from "./db/schema.js";
import { ensureAdminUser, ensureAgendaUser } from "./services/adminService.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  await ensureDatabaseSchema();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
  });

  const startupTasks = [ensureAdminUser(), ensureAgendaUser()];

  Promise.all(startupTasks).catch((error) => {
    console.error("Background startup task failed", error);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed", error);
  process.exit(1);
});
