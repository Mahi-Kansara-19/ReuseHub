const { getQtyInKg } = require("../utils");

const SustainabilityAgent = async (state) => {
  const { listing, analysis } = state;
  if (!listing) return { sustainability: { carbonSaved: 0, landfillReduced: 0, impactScore: 0 } };

  // Calculate quantity in kg
  const quantityKg = getQtyInKg(listing) || 100;

  // CO2 Saved factor per kg based on category
  const factors = {
    "plastic waste": 1.5,
    "paper waste": 0.9,
    "metal waste": 2.2,
    "glass waste": 0.5,
    "e-waste": 3.0,
    "textile waste": 1.2,
    "rubber waste": 1.1,
    "wood waste": 0.6,
  };

  const cat = listing.category.toLowerCase();
  let factor = 0.44; // default baseline factor
  for (const [key, val] of Object.entries(factors)) {
    if (cat.includes(key)) {
      factor = val;
      break;
    }
  }

  const carbonSaved = parseFloat(((quantityKg * factor) / 1000).toFixed(2)); // in Tons
  const landfillReduced = Math.round(quantityKg); // in kg

  // Impact score calculation
  let impactScore = 70;
  if (analysis && analysis.recyclability === "High") {
    impactScore += 15;
  } else if (analysis && analysis.recyclability === "Low") {
    impactScore -= 15;
  }

  if (quantityKg > 5000) {
    impactScore += 12;
  } else if (quantityKg > 1000) {
    impactScore += 8;
  }

  impactScore = Math.min(98, Math.max(35, impactScore));

  return {
    sustainability: {
      carbonSaved,
      landfillReduced,
      impactScore,
    },
  };
};

module.exports = SustainabilityAgent;
