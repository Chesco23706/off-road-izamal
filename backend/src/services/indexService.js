import Tour from "../models/Tour.js";
import User from "../models/User.js";

export const syncDatabaseIndexes = async () => {
  await User.syncIndexes();
  await Tour.syncIndexes();
  console.log("Database indexes synchronized");
};
