const mongoose = require("mongoose");
const WasteListing = require("../models/WasteListing");

// @desc    Create a new waste listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      quantity,
      unit,
      price,
      location,
      availability,
      image,
      phone,
      email,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !category ||
      !description ||
      !quantity ||
      !price ||
      !location ||
      !phone ||
      !email
    ) {
      return res.status(400).json({
        message: "Please include all required fields",
      });
    }

    // Create listing
    const listing = await WasteListing.create({
      name,
      category,
      description,
      quantity,
      unit,
      price,
      location,
      availability: availability || "available",
      image,
      phone,
      email,
      owner: req.user._id,
    });

    const { runMatching } = require("../services/matchingService");
    try {
      await runMatching();
    } catch (error) {
      console.log("Match generation failed:", error.message);
    }

    // Trigger LangGraph AI analysis workflow asynchronously
    const graphApp = require("../langgraph/graph");
    graphApp.invoke({ listingId: listing._id }).catch((err) => {
      console.error("AI workflow failed on listing creation:", err.message);
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get all available waste listings
// @route   GET /api/listings
// @access  Public
const getAllListings = async (req, res) => {
  try {
    const listings = await WasteListing.find().sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get listings created by the logged-in user
// @route   GET /api/listings/my
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const listings = await WasteListing.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update a waste listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid listing ID",
      });
    }

    const listing = await WasteListing.findById(id);

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Check if logged-in user is the owner
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this listing",
      });
    }

    // Fields allowed to be updated
    const allowedUpdates = [
      "name",
      "category",
      "description",
      "quantity",
      "unit",
      "price",
      "location",
      "availability",
      "image",
      "phone",
      "email",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    const updatedListing = await listing.save();

    // Asynchronously trigger AI re-analysis and matching update in real-time
    const graphApp = require("../langgraph/graph");
    const { runMatching } = require("../services/matchingService");
    graphApp.invoke({ listingId: updatedListing._id }).catch((err) => {
      console.error("AI workflow failed on listing update:", err.message);
    });
    runMatching().catch((err) => {
      console.error("Match generation failed on listing update:", err.message);
    });

    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Delete a waste listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid listing ID",
      });
    }

    const listing = await WasteListing.findById(id);

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Check if logged-in user is the owner
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this listing",
      });
    }

    // Perform cascading deletions (using transaction session if supported)
    const Match = require("../models/Match");
    const AIRecommendation = require("../models/AIRecommendation");
    
    let transactionSuccess = false;
    try {
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        await listing.deleteOne({ session });
        await Match.deleteMany({ listing: id }, { session });
        await AIRecommendation.deleteMany({ listingId: id }, { session });
      });
      session.endSession();
      transactionSuccess = true;
      console.log(`[CASCADING DELETE] Transaction succeeded for listing ${id} and related matches.`);
    } catch (err) {
      console.log("Transaction failed or unsupported, falling back to direct cascading delete:", err.message);
    }

    if (!transactionSuccess) {
      await listing.deleteOne();
      await Match.deleteMany({ listing: id });
      await AIRecommendation.deleteMany({ listingId: id });
      console.log(`[CASCADING DELETE] Direct cascading delete completed for listing ${id} and related matches.`);
    }

    res.status(200).json({
      message: "Listing deleted successfully",
      id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getMyListings,
  updateListing,
  deleteListing,
};
