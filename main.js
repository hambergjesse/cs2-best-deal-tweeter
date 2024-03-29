// server.js
import express from "express";
import { getDailyBestDeal } from "./floatFetch.js";
import { createTweet } from "./apiFetch.js";
import cron from "node-cron";

const app = express();
const PORT = process.env.PORT || 3000;

cron.schedule("0 9 * * *", async () => {
  try {
    console.log("Running daily job...");
    const bestDeal = await getDailyBestDeal();
    console.log(bestDeal);

    if (bestDeal) {
      const { id, price, item, reference } = bestDeal.listing;

      const skinName = item.market_hash_name;

      const currentPrice = price / 100;

      const discount =
        ((reference.base_price - currentPrice) / reference.base_price) * 100;

      const tweetData = {
        text: `${skinName} is currently available for $${currentPrice.toFixed(
          2
        )} (${discount.toFixed(
          2
        )}% off).\n\nCheck it out here: https://csfloat.com/item/${id}&ref=rattecs`,
      };

      await createTweet(tweetData);

      console.log("Tweet posted successfully!");
    } else {
      console.log("Failed to retrieve daily best deal");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
