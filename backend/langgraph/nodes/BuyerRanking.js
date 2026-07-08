const Match = require("../../models/Match");
const { getQtyInKg } = require("../utils");

const BuyerRanking = async (state) => {
  const { matches, listing } = state;
  console.log("[AI DEBUG] ---------------------------------------------");
  console.log("[AI DEBUG] Starting BuyerRanking Node");
  console.log("[AI DEBUG] Incoming Matches:", matches);

  if (!matches || !matches.buyers || matches.buyers.length === 0) {
    console.log("[AI DEBUG] No buyers to rank, exiting");
    return { rankings: { rankedBuyers: [] } };
  }

  const supplierQty = getQtyInKg(listing) || 100;
  const rankedBuyers = [];

  for (const matchedBuyer of matches.buyers) {
    const buyerId = matchedBuyer.buyerId;
    const buyerQty = matchedBuyer.buyerQty || 0;
    const qtyDiff = Math.abs(supplierQty - buyerQty);

    // 1. Category Match (50% max)
    // Since they matched category to reach here, they get the full 50 points
    const categoryScore = 50;

    // 2. Quantity Closeness (25% max)
    // Formula: Closer quantities get higher compatibility. Difference max is 100 kg.
    // Score = (1 - (difference / 100)) * 25
    const qtyClosenessScore = Math.max(0, parseFloat(((1 - qtyDiff / 100) * 25).toFixed(2)));

    // 3. Historical Activity (15% max)
    const totalMatches = await Match.countDocuments({ buyer: buyerId });
    const successMatches = await Match.countDocuments({ buyer: buyerId, status: "accepted_by_supplier" });
    
    let historicalScore = 5; // base score if no history
    if (successMatches > 0) {
      historicalScore = 15; // Max score for proven transaction history
    } else if (totalMatches > 0) {
      historicalScore = 10; // Moderate score for active bidding/matching
    }

    // 4. Sustainability Score / Demand Priority (10% max)
    // Active recycling gets baseline priority of 10 points
    const sustainabilityScore = 10;

    // Compile compatibility score
    const compatibilityScore = categoryScore + qtyClosenessScore + historicalScore + sustainabilityScore;
    const finalScore = Math.min(99, Math.max(50, Math.round(compatibilityScore)));

    console.log(`[AI DEBUG] Buyer: ${matchedBuyer.businessName}`);
    console.log(`  - Supplier quantity: ${supplierQty} kg`);
    console.log(`  - Buyer quantity: ${buyerQty} kg`);
    console.log(`  - Quantity difference: ${qtyDiff} kg`);
    console.log(`  - Passed ±100 kg rule: ${qtyDiff <= 100}`);
    console.log(`  - Score breakdown: Category=${categoryScore}, QtyCloseness=${qtyClosenessScore}, History=${historicalScore}, Sustainability=${sustainabilityScore}`);
    console.log(`  - Final compatibility score: ${finalScore}%`);

    rankedBuyers.push({
      buyerId,
      businessName: matchedBuyer.businessName,
      compatibility: finalScore,
      reasons: matchedBuyer.reasons,
    });
  }

  // Sort ranked buyers by compatibility score descending
  rankedBuyers.sort((a, b) => b.compatibility - a.compatibility);

  // Strictly limit the output list to the top 3 buyers as specified
  const topRankedBuyers = rankedBuyers.slice(0, 3);

  console.log("[AI DEBUG] Final Top Recommended Buyers:", topRankedBuyers);
  console.log("[AI DEBUG] Exiting BuyerRanking Node");
  console.log("[AI DEBUG] ---------------------------------------------");

  return {
    rankings: {
      rankedBuyers: topRankedBuyers,
    },
  };
};

module.exports = BuyerRanking;
