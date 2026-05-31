import app from "./app.js";
import connectDatabase from "./config/db.js";
import { ensureAdminUser } from "./services/adminService.js";
import { ensureDatabaseIndexes } from "./services/indexService.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
  });

  const startupTasks = [ensureAdminUser()];

  if (process.env.AUTO_CREATE_INDEXES === "true") {
    startupTasks.push(ensureDatabaseIndexes());
  }

  Promise.all(startupTasks).catch((error) => {
    console.error("Background startup task failed", error);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed", error);
  process.exit(1);
});
