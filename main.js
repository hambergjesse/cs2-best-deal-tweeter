import express from "express";
import cron from "node-cron";
import dotenv from "dotenv";

import { manualTweeter } from "./manualTweeter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Scheduled job to run every 4 hours
cron.schedule("0 */4 * * *", async () => {
  manualTweeter();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
