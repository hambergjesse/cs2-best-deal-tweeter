import { getDailyBestDeal } from "./floatFetch.js";

async function manualProcess() {
  try {
    console.log("Running manual process...");
    const bestDeal = await getDailyBestDeal();
    console.log(bestDeal);
    console.log("Manual process completed successfully");
  } catch (error) {
    console.error("Error during manual process:", error);
  }
}

manualProcess();
