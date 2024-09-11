import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.FLOAT_API_KEY;

const convertToDollars = (priceCents) => (priceCents / 100).toFixed(2);

export async function getDailyBestDeal() {
  try {
    const url = "https://csfloat.com/api/v1/listings";
    const response = await axios.get(url, {
      params: {
        limit: 50,
        sort_by: "highest_discount",
        min_price: 500,
        type: "buy_now",
      },
      headers: {
        Authorization: apiKey,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    const data = response.data;

    if (data.length === 0) {
      console.log("No 'buy_now' listings found.");
      return null;
    }

    let bestDealListing = null;
    let maxDiscount = -1;

    data.forEach((listing) => {
      const { price, item, reference } = listing;

      if (price && item && reference) {
        const marketPriceDollars = convertToDollars(reference.predicted_price);
        const listingPriceDollars = convertToDollars(price);

        if (marketPriceDollars > 0) {
          const discount =
            ((marketPriceDollars - listingPriceDollars) / marketPriceDollars) *
            100;

          if (listingPriceDollars >= 5 && discount > maxDiscount) {
            maxDiscount = discount;
            bestDealListing = {
              id: listing.id,
              skinName: item.market_hash_name,
              currentPrice: listingPriceDollars,
              discount: parseFloat(discount.toFixed(2)),
              averagePrice: marketPriceDollars,
              sellerUID: listing.seller.steam_id,
              imageURL: `https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url}`,
              floatValue: item.float_value,
              inspectLink: item.inspect_link,
            };
          }
        }
      }
    });

    if (bestDealListing) {
      const link = `https://csfloat.com/item/${bestDealListing.id}`;
      return { listing: bestDealListing, link };
    } else {
      console.log(
        "No optimal deal found. Returning the first listing as a fallback."
      );
      const firstListing = data.find(
        (listing) => convertToDollars(listing.price) >= 5
      );
      if (firstListing) {
        const marketPriceDollars = convertToDollars(
          firstListing.reference.predicted_price
        );
        const listingPriceDollars = convertToDollars(firstListing.price);
        const discount =
          ((marketPriceDollars - listingPriceDollars) / marketPriceDollars) *
          100;

        console.log("Best Deal Listing (Fallback):");
        console.log(`Listing ID: ${firstListing.id}`);
        console.log(`Skin Name: ${firstListing.item.market_hash_name}`);
        console.log(`Current Price: ${convertToDollars(firstListing.price)}`);
        console.log(`Discount: ${parseFloat(discount.toFixed(2))}%`);
        console.log(`Average Price: ${marketPriceDollars}`);
        console.log(`Seller UID: ${firstListing.seller.steam_id}`);
        console.log(
          `Listing Image URL: https://community.cloudflare.steamstatic.com/economy/image/${firstListing.item.icon_url}`
        );
        console.log(`Float Value: ${firstListing.item.float_value}`);
        console.log(`Inspect Link: ${firstListing.item.inspect_link}`);
        console.log(
          `Listing Link: https://csfloat.com/item/${firstListing.id}`
        );

        return {
          listing: firstListing,
        };
      } else {
        console.log("No fallback listing found with price above $5.");
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching daily best deal:", error.message);
    throw error;
  }
}
