const WasteListing = require("../../models/WasteListing");
const { getQtyInKg, getPricePerKg } = require("../utils");

const ListingValidator = async (state) => {
  const { listingId } = state;
  const listing = await WasteListing.findById(listingId);
  if (!listing) {
    return {
      listing: null,
      validation: {
        status: "invalid",
        errors: ["Listing not found in database"],
      },
    };
  }

  const errors = [];
  // Validate required fields
  const required = ["name", "category", "description", "quantity", "price", "location", "phone", "email"];
  required.forEach((field) => {
    if (!listing[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate quantity
  const qtyKg = getQtyInKg(listing);
  if (qtyKg <= 0) {
    errors.push(`Invalid quantity: ${listing.quantity}`);
  }

  // Validate price
  const priceVal = getPricePerKg(listing);
  if (priceVal < 0 || priceVal > 10000 || isNaN(priceVal)) {
    errors.push(`Unrealistic or invalid price: ${listing.price}`);
  }

  // Check duplicate listings by same owner in the last 5 minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const duplicate = await WasteListing.findOne({
    owner: listing.owner,
    name: listing.name,
    category: listing.category,
    _id: { $ne: listing._id },
    createdAt: { $gte: fiveMinutesAgo },
  });
  if (duplicate) {
    errors.push("Duplicate listing detected within the last 5 minutes");
  }

  return {
    listing: listing,
    validation: {
      status: errors.length > 0 ? "invalid" : "valid",
      errors,
    },
  };
};

module.exports = ListingValidator;
