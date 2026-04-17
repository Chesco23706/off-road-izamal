import app from "./app.js";
import connectDatabase from "./config/db.js";
import { ensureAdminUser } from "./services/adminService.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});

connectDatabase()
  .then(() => ensureAdminUser())
  .catch((error) => {
    console.error("MongoDB connection failed", error);
  });
