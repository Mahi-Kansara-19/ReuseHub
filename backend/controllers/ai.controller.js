const AIRecommendation = require("../models/AIRecommendation");
const Match = require("../models/Match");
const WasteListing = require("../models/WasteListing");
const graphApp = require("../langgraph/graph");

// @desc    Trigger AI Analysis for a listing
// @route   POST /api/ai/analyze/:listingId
// @access  Private
const analyzeListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    // Invoke LangGraph workflow
    const result = await graphApp.invoke({ listingId });

    // Retrieve the saved recommendation
    const recommendation = await AIRecommendation.findOne({ listingId })
      .populate("listingId")
      .populate("supplierId", "businessName ownerName email phone")
      .populate("recommendedBuyers.buyerId", "businessName ownerName email phone businessCategory location");

    if (!recommendation) {
      return res.status(404).json({
        message: "Failed to generate AI recommendation",
        errors: result?.validation?.errors || [],
      });
    }

    res.status(200).json(recommendation);
  } catch (error) {
    console.error("Error in analyzeListing controller:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get AI Recommendation for a listing
// @route   GET /api/ai/recommendation/:listingId
// @access  Private
const getRecommendation = async (req, res) => {
  try {
    const { listingId } = req.params;

    const recommendation = await AIRecommendation.findOne({ listingId })
      .populate("listingId")
      .populate("supplierId", "businessName ownerName email phone")
      .populate("recommendedBuyers.buyerId", "businessName ownerName email phone businessCategory location");

    if (!recommendation) {
      return res.status(404).json({
        message: "No AI insights found for this listing",
      });
    }

    res.status(200).json(recommendation);
  } catch (error) {
    console.error("Error in getRecommendation controller:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Share contact details with a buyer
// @route   POST /api/ai/share-contact
// @access  Private
const shareContactWithBuyer = async (req, res) => {
  try {
    const { listingId, buyerId } = req.body;
    const supplierId = req.user._id;

    // Verify listing exists and belongs to supplier
    const listing = await WasteListing.findById(listingId);
    if (!listing || listing.owner.toString() !== supplierId.toString()) {
      return res.status(403).json({
        message: "Not authorized or listing not found",
      });
    }

    // Find or create match
    let match = await Match.findOne({
      listing: listingId,
      buyer: buyerId,
    });

    if (match) {
      match.status = "accepted_by_supplier";
      await match.save();
    } else {
      match = await Match.create({
        buyer: buyerId,
        supplier: supplierId,
        listing: listingId,
        matchScore: 100,
        matchReason: ["Supplier initiated contact sharing via AI recommendations"],
        status: "accepted_by_supplier",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact details shared successfully!",
      match,
    });
  } catch (error) {
    console.error("Error in shareContactWithBuyer controller:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  analyzeListing,
  getRecommendation,
  shareContactWithBuyer,
};
