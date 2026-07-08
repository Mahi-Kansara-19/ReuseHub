const WasteAnalysis = async (state) => {
  const { listing } = state;
  if (!listing) return {};

  let qualityScore = 80; // default base score
  
  // Rule-based quality score adjustments
  if (listing.description && listing.description.length > 50) {
    qualityScore += 10;
  }
  if (listing.image) {
    qualityScore += 5;
  } else {
    qualityScore -= 5;
  }
  
  // Categorical recyclability
  const cat = (listing.category || "").toLowerCase();
  let recyclability = "Medium";
  if (["plastic waste", "metal waste", "paper waste", "glass waste"].some(c => cat.includes(c))) {
    recyclability = "High";
    qualityScore += 5;
  } else if (["food waste", "chemical waste"].some(c => cat.includes(c))) {
    recyclability = "Low";
    qualityScore -= 10;
  }

  // Bound quality score between 30 and 100
  qualityScore = Math.max(30, Math.min(100, qualityScore));

  const confidence = parseFloat((0.85 + (qualityScore / 100) * 0.13 + Math.random() * 0.02).toFixed(2));

  return {
    analysis: {
      qualityScore,
      recyclability,
      confidence,
    },
  };
};

module.exports = WasteAnalysis;
