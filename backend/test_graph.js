const mongoose = require("mongoose");
const graphApp = require("./langgraph/graph");
const WasteListing = require("./models/WasteListing");
const AIRecommendation = require("./models/AIRecommendation");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const test = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Find any listing
    const listing = await WasteListing.findOne();
    if (!listing) {
      console.log("No listings found in database. Cannot run test.");
      return;
    }

    console.log("Running AI workflow for listing:", listing.name, "(id:", listing._id, ")");
    const result = await graphApp.invoke({ listingId: listing._id });
    console.log("Workflow completed! State output:");
    console.log("Validation status:", result.validation?.status);
    console.log("Analysis quality:", result.analysis?.qualityScore);
    console.log("Matches count:", result.matches?.buyers?.length);
    console.log("Suggested Price:", result.price?.suggestedPrice);
    console.log("Revenue:", result.price?.expectedRevenue);
    console.log("Carbon Saved:", result.sustainability?.carbonSaved);
    console.log("Landfill Reduced:", result.sustainability?.landfillReduced);

    const savedRec = await AIRecommendation.findOne({ listingId: listing._id });
    console.log("Saved AIRecommendation reasoning:", savedRec?.reasoning);
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await mongoose.disconnect();
  }
};

test();
