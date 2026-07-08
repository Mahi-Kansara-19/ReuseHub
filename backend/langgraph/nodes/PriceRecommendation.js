const WasteListing = require("../../models/WasteListing");
const Demand = require("../../models/Demand");
const { getQtyInKg, getPricePerKg } = require("../utils");

const PriceRecommendation = async (state) => {
  const { listing } = state;
  if (!listing) return { price: { suggestedPrice: 0, expectedRevenue: 0, demand: "Low" } };

  // Calculate listing quantity in kg
  const listingQty = getQtyInKg(listing) || 100;

  // Query previous listings of the same category
  const similarListings = await WasteListing.find({
    category: listing.category,
  }).limit(40);

  // Parse string prices in javascript to get a real average
  const validPrices = [];
  similarListings.forEach((l) => {
    const p = getPricePerKg(l);
    if (p > 0) {
      validPrices.push(p);
    }
  });

  let suggestedPrice = 0;
  if (validPrices.length > 0) {
    const sumPrices = validPrices.reduce((sum, p) => sum + p, 0);
    suggestedPrice = Math.round(sumPrices / validPrices.length);
  } else {
    // Baseline price per kg by category if no history
    const baselinePrices = {
      "plastic waste": 25,
      "paper waste": 15,
      "metal waste": 85,
      "glass waste": 12,
      "e-waste": 120,
      "textile waste": 20,
      "food waste": 5,
      "wood waste": 10,
      "rubber waste": 30,
      "construction waste": 8,
      "chemical waste": 50,
      "packaging waste": 15,
    };
    const cat = listing.category.toLowerCase();
    suggestedPrice = baselinePrices[cat] || 20; // default 20/kg
  }

  // Adjust suggested price based on quantity (economies of scale discount)
  if (listingQty > 5000) {
    suggestedPrice = Math.round(suggestedPrice * 0.9); // 10% discount for bulk
  } else if (listingQty > 1000) {
    suggestedPrice = Math.round(suggestedPrice * 0.95);
  }

  // Multiply price per kg by quantity in kg to get real expected revenue
  const expectedRevenue = Math.round(suggestedPrice * listingQty);

  // Demand assessment based on count of active buyer demands in this category
  const demandCount = await Demand.countDocuments({ category: listing.category, status: "open" });
  let demand = "Medium";
  if (demandCount > 5) {
    demand = "High";
  } else if (demandCount < 2) {
    demand = "Low";
  }

  return {
    price: {
      suggestedPrice,
      expectedRevenue,
      demand,
    },
  };
};

module.exports = PriceRecommendation;
