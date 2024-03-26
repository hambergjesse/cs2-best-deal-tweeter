import { getDailyBestDeal } from "./floatFetch.js";
import { createTweet } from "./apiFetch.js";

(async () => {
  try {
    // Fetch the daily best deal
    const bestDeal = await getDailyBestDeal();
    console.log(bestDeal);

    if (bestDeal) {
      // Extract necessary information from best deal
      const { id, price, item, reference } = bestDeal.listing;

      const skinName = item.market_hash_name;

      // Convert price from cents to dollars
      const currentPrice = price / 100;

      const discount =
        ((reference.base_price - currentPrice) / reference.base_price) * 100;

      // Create tweet data with information from the best deal
      const tweetData = {
        text: `${skinName} is currently available for $${currentPrice.toFixed(
          2
        )} (${discount.toFixed(
          2
        )}% off).\n\nCheck it out here: https://csfloat.com/item/${id}`,
      };

      // Tweet out the best deal
      await createTweet(tweetData);

      console.log("Tweet posted successfully!");
    } else {
      console.log("Failed to retrieve daily best deal");
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(-1);
  }
  process.exit();
})();
