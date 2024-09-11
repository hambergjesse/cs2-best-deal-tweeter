import express from "express";
import cron from "node-cron";
import { getDailyBestDeal } from "./floatFetch.js";
import { createTweet } from "./apiFetch.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Scheduled job to run every 4 hours
cron.schedule("0 */4 * * *", async () => {
  try {
    console.log("Running hourly job...");
    const bestDeal = await getDailyBestDeal();

    // Log the entire `bestDeal` object to inspect its structure
    console.log("Best deal data:", bestDeal);

    if (bestDeal && bestDeal.listing) {
      const {
        id,
        currentPrice,
        skinName,
        discount,
        averagePrice,
        sellerUID,
        inspectLink,
        floatValue,
      } = bestDeal.listing;

      // Log extracted deal details
      console.log("Extracted deal details:", {
        id,
        currentPrice,
        skinName,
        discount,
        averagePrice,
        sellerUID,
        inspectLink,
        floatValue,
      });

      // Validate required fields and handle missing data
      if (
        id &&
        skinName &&
        currentPrice &&
        discount !== undefined &&
        averagePrice &&
        sellerUID &&
        bestDeal.link
      ) {
        // Convert prices to dollars
        const currentPriceDollars = parseFloat(currentPrice);
        const averagePriceDollars = parseFloat(averagePrice);
        if (isNaN(currentPriceDollars) || isNaN(averagePriceDollars)) {
          throw new Error("Price data is not in the correct format");
        }

        // Append ref parameter to the link
        const modifiedLink = `${bestDeal.link}&ref=rattecs`;

        // Prepare tweet text
        let tweetText = `${skinName} is currently available for $${currentPriceDollars.toFixed(
          2
        )} (${discount.toFixed(
          2
        )}% off).\n\nCheck it out here: ${modifiedLink}`;

        // Add float value information if available
        if (floatValue !== undefined) {
          console.log("No float value found");
        }

        // Prepare tweet data
        const tweetData = {
          text: tweetText,
        };

        // Create tweet
        await createTweet(tweetData);
        console.log("Tweet posted successfully!");
      } else {
        console.error("Error: Missing required data in the best deal listing.");
      }
    } else {
      console.log("Failed to retrieve daily best deal");
    }
  } catch (error) {
    console.error("Error in scheduled job:", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
