const calculateMatchScore = (demand, listing) => {
    let score = 0;
    let reasons = [];

    const demandCategory = demand.category?.toLowerCase().trim() || "";
    const listingCategory = listing.category?.toLowerCase().trim() || "";

    const demandLocation = demand.location?.toLowerCase().trim() || "";
    const listingLocation = listing.location?.toLowerCase().trim() || "";

    let categoryMatches = false;
    let locationMatches = false;

    // 1. Category matching
    if (demandCategory && demandCategory === listingCategory) {
        categoryMatches = true;
        reasons.push("Waste category matches");
    }

    // 2. Location matching
    if (
      demandLocation && listingLocation &&
      (demandLocation === listingLocation ||
       demandLocation.includes(listingLocation) ||
       listingLocation.includes(demandLocation))
    ) {
        locationMatches = true;
        reasons.push("Same or nearby location");
    }

    if (categoryMatches && locationMatches) {
        score = 100;
    } else {
        score = 0;
    }

    return {
        score,
        reasons
    };
};

const runMatching = async () => {
    try {
        const Demand = require("../models/Demand");
        const WasteListing = require("../models/WasteListing");
        const Match = require("../models/Match");

        const demands = await Demand.find({ status: "open" });
        const listings = await WasteListing.find({ availability: { $regex: /^available$/i } });

        for (const demand of demands) {
            for (const listing of listings) {
                // Avoid matching a user's own listing to their own demand if relevant, 
                // but let's stick to the matching scoring logic first.
                const result = calculateMatchScore(demand, listing);

                if (result.score >= 60) {
                    const existingMatch = await Match.findOne({
                        buyer: demand.buyer,
                        demand: demand._id,
                        listing: listing._id,
                    });

                    if (!existingMatch) {
                        await Match.create({
                            buyer: demand.buyer,
                            supplier: listing.owner,
                            demand: demand._id,
                            listing: listing._id,
                            matchScore: result.score,
                            matchReason: result.reasons,
                            status: "new",
                        });
                        console.log(`✅ Match created: ${demand.materialName} ↔ ${listing.name}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error running match calculation service:", error);
    }
};

module.exports = {
    calculateMatchScore,
    runMatching
};