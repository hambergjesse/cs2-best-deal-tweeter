import { getDailyBestDeal } from "./floatFetch.js";

console.log("Twitter Client ID:", process.env.TWITTER_CLIENT_ID);
console.log("Twitter Client Secret:", process.env.TWITTER_CLIENT_SECRET);
console.log("Consumer Key:", process.env.CONSUMER_KEY);
console.log("Consumer Secret:", process.env.CONSUMER_SECRET);
console.log("Access Token:", process.env.ACCESS_TOKEN);
console.log("Access Token Secret:", process.env.ACCESS_TOKEN_SECRET);
console.log("Twitter Bearer Token:", process.env.TWITTER_BEARER_TOKEN);
console.log("Float API Key:", process.env.FLOAT_API_KEY);

async function manualProcess() {
  try {
    console.log("Running manual process...");
    const bestDeal = await getDailyBestDeal();
    console.log(bestDeal || "No deals found.");
  } catch (error) {
    console.error("Error during manual process:", error.message);
  }
}

manualProcess();
