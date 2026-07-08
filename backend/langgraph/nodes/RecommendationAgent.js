const AIRecommendation = require("../../models/AIRecommendation");

const RecommendationAgent = async (state) => {
  const { listingId, listing, validation, analysis, rankings, price, sustainability } = state;

  console.log("[AI DEBUG] ---------------------------------------------");
  console.log("[AI DEBUG] Starting RecommendationAgent Node");
  console.log("[AI DEBUG] Validation State:", validation);
  console.log("[AI DEBUG] Rankings State:", rankings);
  console.log("[AI DEBUG] Price State:", price);
  console.log("[AI DEBUG] Sustainability State:", sustainability);

  if (validation && validation.status === "invalid") {
    // Save a failed recommendation state
    const reasonText = "Listing validation failed: " + (validation.errors || []).join(", ");
    
    // Clean old recommendation for this listing if any exists
    await AIRecommendation.deleteMany({ listingId });

    await AIRecommendation.create({
      listingId,
      supplierId: listing ? listing.owner : null,
      recommendedBuyers: [],
      qualityScore: 0,
      suggestedPrice: 0,
      expectedRevenue: 0,
      carbonSaved: 0,
      impactScore: 0,
      confidence: 0,
      reasoning: reasonText,
    });

    console.log("[AI DEBUG] Failed validation. Saved failure reason:", reasonText);
    console.log("[AI DEBUG] Exiting RecommendationAgent Node");
    console.log("[AI DEBUG] ---------------------------------------------");

    return {
      recommendation: {
        bestBuyer: null,
        confidence: 0,
        reasons: validation.errors || [],
      },
    };
  }

  const buyers = rankings?.rankedBuyers || [];
  let bestBuyer = null;
  let finalConfidence = 85;
  const reasons = [];

  if (buyers.length > 0) {
    const topBuyer = buyers[0];
    bestBuyer = topBuyer.businessName;
    
    // Set confidence based on top buyer compatibility and analysis confidence
    const analysisConf = analysis?.confidence || 0.9;
    finalConfidence = Math.min(99, Math.round(topBuyer.compatibility * 0.8 + (analysisConf * 100) * 0.2));

    // Formulate reasoning text
    reasons.push(`${topBuyer.businessName} is the best match because they have consistent interest in ${listing.category}`);
    if (price && price.demand === "High") {
      reasons.push("there is high current demand for this material type");
    } else {
      reasons.push("they require a similar quantity of materials");
    }
    if (topBuyer.reasons && topBuyer.reasons.length > 0) {
      // Append matching insights
      reasons.push(topBuyer.reasons[0].toLowerCase());
    }
    reasons.push("resulting in a high compatibility and transaction success potential");
  } else {
    reasons.push("No buyers matching this material category and location were found at this time. We suggest listing additional items to attract more interest.");
  }

  // Create the recommendation document in MongoDB
  const recommendedBuyers = buyers.map((b) => ({
    buyerId: b.buyerId,
    businessName: b.businessName,
    compatibility: b.compatibility,
    reasons: b.reasons,
  }));

  // Clean old recommendation for this listing if any exists
  await AIRecommendation.deleteMany({ listingId });

  // Generate a friendly joined string for reasoning
  let reasoningStr = reasons.join(", ");
  if (buyers.length > 0) {
    reasoningStr = reasons[0] + ", " + reasons.slice(1).join(", ") + ".";
  }

  const newRec = await AIRecommendation.create({
    listingId,
    supplierId: listing.owner,
    recommendedBuyers,
    qualityScore: analysis?.qualityScore || 0,
    suggestedPrice: price?.suggestedPrice || 0,
    expectedRevenue: price?.expectedRevenue || 0,
    carbonSaved: sustainability?.carbonSaved || 0,
    impactScore: sustainability?.impactScore || 0,
    confidence: finalConfidence,
    reasoning: reasoningStr,
  });

  console.log("[AI DEBUG] Saved Recommendation:", newRec);
  console.log("[AI DEBUG] Exiting RecommendationAgent Node");
  console.log("[AI DEBUG] ---------------------------------------------");

  return {
    recommendation: {
      bestBuyer,
      confidence: finalConfidence,
      reasons,
    },
  };
};

module.exports = RecommendationAgent;
