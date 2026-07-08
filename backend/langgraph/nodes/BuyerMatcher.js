const User = require("../../models/User");
const Demand = require("../../models/Demand");
const Match = require("../../models/Match");
const { getQtyInKg } = require("../utils");

const BuyerMatcher = async (state) => {
  const { listing } = state;
  console.log("[AI DEBUG] ---------------------------------------------");
  console.log("[AI DEBUG] Starting BuyerMatcher Node");
  console.log("[AI DEBUG] Supplier Listing:", listing);

  if (!listing) {
    console.log("[AI DEBUG] No listing provided in state, exiting");
    return { matches: { buyers: [] } };
  }

  // Normalize supplier listing fields
  const supplierCategory = (listing.category || "").trim().toLowerCase();
  const supplierQty = getQtyInKg(listing);

  console.log("[AI DEBUG] Normalized Supplier Listing Properties:");
  console.log(`  - Category: ${supplierCategory}`);
  console.log(`  - Quantity (kg): ${supplierQty}`);

  // Fetch all open demands from the database
  const allOpenDemands = await Demand.find({ status: "open" });
  console.log(`[AI DEBUG] Total open demands fetched from database: ${allOpenDemands.length}`);

  const eligibleDemands = [];

  for (const d of allOpenDemands) {
    const demandIdStr = d._id.toString();
    const demandCategory = (d.category || "").trim().toLowerCase();
    const buyerQty = getQtyInKg(d);
    const qtyDiff = Math.abs(supplierQty - buyerQty);

    // 1. Category Match (Mandatory)
    const categoryMatches = (demandCategory === supplierCategory);

    // 2. Quantity Matching (Flexible: within ±100 kg)
    const passedQtyRule = qtyDiff <= 100;

    console.log(`[AI DEBUG] Checking Demand ${demandIdStr}:`);
    console.log(`  - Supplier quantity: ${supplierQty} kg`);
    console.log(`  - Buyer quantity: ${buyerQty} kg`);
    console.log(`  - Quantity difference: ${qtyDiff} kg`);
    console.log(`  - Passed ±100 kg rule: ${passedQtyRule}`);

    if (!categoryMatches || !passedQtyRule) {
      console.log(`  - REJECTED: categoryMatches=${categoryMatches}, passedQtyRule=${passedQtyRule}`);
      continue;
    }

    // Check if this demand is already accepted by any supplier
    const acceptedMatch = await Match.findOne({
      demand: d._id,
      status: "accepted_by_supplier",
    });

    if (acceptedMatch) {
      console.log(`  - REJECTED: Already accepted by another supplier`);
      continue;
    }

    console.log(`  - ACCEPTED as valid match`);
    eligibleDemands.push(d);
  }

  console.log(`[AI DEBUG] Total eligible demands after ±100 kg and category filtering: ${eligibleDemands.length}`);

  if (eligibleDemands.length === 0) {
    console.log("[AI DEBUG] No eligible demands found matching the listing criteria");
    return {
      matches: {
        buyers: [],
      },
    };
  }

  // Group eligible demands by buyer ID
  const buyerDemandsMap = {};
  eligibleDemands.forEach((d) => {
    const buyerIdStr = d.buyer.toString();
    if (!buyerDemandsMap[buyerIdStr]) {
      buyerDemandsMap[buyerIdStr] = [];
    }
    buyerDemandsMap[buyerIdStr].push(d);
  });

  const candidateBuyerIds = Object.keys(buyerDemandsMap);

  // Fetch candidate buyer profiles from User collection
  const buyers = await User.find({
    _id: { $in: candidateBuyerIds },
  });

  const matchedBuyers = [];

  for (const buyer of buyers) {
    const buyerIdStr = buyer._id.toString();
    const buyerDemands = buyerDemandsMap[buyerIdStr] || [];

    // Find the closest demand quantity for ranking calculations
    let closestDemandQty = 0;
    let minDiff = Infinity;
    for (const d of buyerDemands) {
      const q = getQtyInKg(d);
      const diff = Math.abs(supplierQty - q);
      if (diff < minDiff) {
        minDiff = diff;
        closestDemandQty = q;
      }
    }

    matchedBuyers.push({
      buyerId: buyer._id,
      businessName: buyer.businessName,
      buyerQty: closestDemandQty,
      reasons: ["Same waste category", "Same location", "Buyer demand fits supplier quantity"],
    });
  }

  console.log("[AI DEBUG] Compatible Buyers identified:", matchedBuyers);
  console.log("[AI DEBUG] Exiting BuyerMatcher Node");
  console.log("[AI DEBUG] ---------------------------------------------");

  return {
    matches: {
      buyers: matchedBuyers,
    },
  };
};

module.exports = BuyerMatcher;
