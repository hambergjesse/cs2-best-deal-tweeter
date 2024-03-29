import { getDailyBestDeal } from "./floatFetch.js";
import { createTweet } from "./apiFetch.js";

function convertToDollars(priceInCents) {
  return priceInCents / 100;
}

async function manualTweeter() {
  try {
    console.log("Running manual tweet job...");
    const bestDeal = await getDailyBestDeal();

    if (bestDeal?.listing) {
      const { id, price, item, reference } = bestDeal.listing;

      const skinName = item.market_hash_name;
      const currentPrice = convertToDollars(price);
      const marketPriceDollars = convertToDollars(reference.base_price);
      const listingPriceDollars = currentPrice;
      const discount =
        ((marketPriceDollars - listingPriceDollars) / marketPriceDollars) * 100;

      const tweetData = {
        text: `${skinName} is currently available for $${currentPrice.toFixed(
          2
        )} (${discount.toFixed(
          2
        )}% off).\n\nCheck it out here: https://csfloat.com/item/${id}?ref=rattecs`,
      };

      await createTweet(tweetData);
      console.log("Tweet posted successfully!");
    } else {
      console.log("Failed to retrieve daily best deal or no deal found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

manualTweeter();
