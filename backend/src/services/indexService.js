import Tour from "../models/Tour.js";
import User from "../models/User.js";

export const ensureDatabaseIndexes = async () => {
  await User.createIndexes();
  await Tour.createIndexes();
  console.log("Database indexes ready");
};
