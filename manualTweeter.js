import { getDailyBestDeal } from "./floatFetch.js";
import { createTweet } from "./apiFetch.js";

async function manualTweeter() {
  try {
    console.log("Running manual tweet job...");
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
        sellerUID, // This field is now optional
        imageURL,
        floatValue,
        inspectLink,
      } = bestDeal.listing;

      // Log extracted deal details
      console.log("Extracted deal details:", {
        id,
        currentPrice,
        skinName,
        discount,
        averagePrice,
        sellerUID,
        imageURL,
        floatValue,
        inspectLink,
      });

      // Validate required fields and handle missing data
      if (
        id &&
        skinName &&
        currentPrice &&
        discount !== undefined &&
        averagePrice &&
        imageURL &&
        bestDeal.link
      ) {
        // Convert prices to dollars
        const currentPriceDollars = parseFloat(currentPrice);
        const averagePriceDollars = parseFloat(averagePrice);
        if (isNaN(currentPriceDollars) || isNaN(averagePriceDollars)) {
          throw new Error("Price data is not in the correct format");
        }

        // Check if the link already contains a query string
        let modifiedLink;
        if (bestDeal.link.includes("?")) {
          modifiedLink = `${bestDeal.link}&ref=rattecs`;
        } else {
          modifiedLink = `${bestDeal.link}?ref=rattecs`;
        }

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
      console.log("Failed to retrieve daily best deal or no deal found.");
    }
  } catch (error) {
    console.error("Error during manual tweet job:", error.message);
  }
}

manualTweeter();
