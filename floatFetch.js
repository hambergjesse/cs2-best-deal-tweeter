import axios from "axios";

const apiKey = process.env.FLOAT_API_KEY;

const convertToDollars = (priceCents) => (priceCents / 100).toFixed(2);

export async function getDailyBestDeal() {
  try {
    const url =
      "https://csfloat.com/api/v1/listings?limit=50&sort_by=highest_discount";
    const response = await axios.get(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    const data = response.data;
    if (data.length > 0) {
      let bestDealListing = null;
      let maxDiscount = 0;

      data.forEach((listing) => {
        const { price, item, seller } = listing;
        if (price && item && item.scm && item.scm.price) {
          const marketPriceDollars = convertToDollars(item.scm.price);
          const listingPriceDollars = convertToDollars(price);
          const discount =
            ((marketPriceDollars - listingPriceDollars) / marketPriceDollars) *
            100;

          if (discount > maxDiscount) {
            maxDiscount = discount;
            bestDealListing = {
              id: listing.id,
              skinName: item.market_hash_name,
              currentPrice: listingPriceDollars,
              discount: parseFloat(discount.toFixed(2)),
              averagePrice: marketPriceDollars,
              sellerUID: seller.steam_id,
              imageURL: `https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url}`,
              floatValue: item.float_value,
              inspectLink: item.inspect_link,
            };
          }
        }
      });

      if (bestDealListing) {
        const link = `https://csfloat.com/item/${bestDealListing.id}`;
        return { listing: bestDealListing, link };
      } else {
        // Fallback listing when no optimal deal is found
        console.log(
          "No optimal deal found. Returning the first listing as a fallback."
        );
        const firstListing = data[0];

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
      }
    } else {
      console.log("No listings found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching daily best deal:", error.message);
    throw error;
  }
}
