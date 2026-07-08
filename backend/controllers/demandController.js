const mongoose = require("mongoose");
const Demand = require("../models/Demand");

const createDemand = async (req, res) => {
  try {
    const {
      materialName,
      category,
      quantity,
      unit,
      description,
      location,
      phone,
      email,
      neededBy,
      status,
    } = req.body;

    if (
      !materialName ||
      !category ||
      !quantity ||
      !unit ||
      !description ||
      !location ||
      !phone ||
      !email ||
      !neededBy
    ) {
      return res.status(400).json({
        message: "Please include all required fields",
      });
    }

    const demand = await Demand.create({
      materialName,
      category,
      quantity,
      unit,
      description,
      location,
      phone,
      email,
      neededBy,
      status: status || "open",
      buyer: req.user._id,
      businessName: req.user.businessName || req.user.name || "Buyer",
    });

    const { runMatching } = require("../services/matchingService");
    try {
      await runMatching();
    } catch (error) {
      console.log("Match generation failed:", error.message);
    }


res.status(201).json(demand);
  } catch (error) {
    console.log("Create Demand Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllDemands = async (req, res) => {
  try {
    const demands = await Demand.find().sort({ createdAt: -1 });
    res.status(200).json(demands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyDemands = async (req, res) => {
  try {
    const demands = await Demand.find({ buyer: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(demands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDemand = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid demand ID" });
    }

    const demand = await Demand.findById(id);

    if (!demand) {
      return res.status(404).json({ message: "Demand not found" });
    }

    if (demand.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this demand",
      });
    }

    const allowedUpdates = [
      "materialName",
      "category",
      "quantity",
      "unit",
      "description",
      "location",
      "phone",
      "email",
      "neededBy",
      "status",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        demand[field] = req.body[field];
      }
    });

    const updatedDemand = await demand.save();

    // Asynchronously trigger matching updates and AI workflow refreshes in real-time
    const { runMatching } = require("../services/matchingService");
    const WasteListing = require("../models/WasteListing");
    const graphApp = require("../langgraph/graph");
    runMatching().catch(err => console.error("Matching failed on demand update:", err.message));
    
    WasteListing.find({ category: updatedDemand.category }).then(listings => {
      listings.forEach(l => {
        graphApp.invoke({ listingId: l._id }).catch(err => console.error("AI refresh failed on listing:", l._id, err.message));
      });
    }).catch(err => console.error("Listing lookup failed on demand update:", err.message));

    res.status(200).json(updatedDemand);
  } catch (error) {
    console.log("Update Demand Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteDemand = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid demand ID" });
    }

    const demand = await Demand.findById(id);

    if (!demand) {
      return res.status(404).json({ message: "Demand not found" });
    }

    if (demand.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this demand",
      });
    }

    // Perform cascading deletions (using transaction session if supported)
    const Match = require("../models/Match");
    
    let transactionSuccess = false;
    try {
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        await demand.deleteOne({ session });
        await Match.deleteMany({ demand: id }, { session });
      });
      session.endSession();
      transactionSuccess = true;
      console.log(`[CASCADING DELETE] Transaction succeeded for demand ${id} and related matches.`);
    } catch (err) {
      console.log("Transaction failed or unsupported, falling back to direct cascading delete:", err.message);
    }

    if (!transactionSuccess) {
      await demand.deleteOne();
      await Match.deleteMany({ demand: id });
      console.log(`[CASCADING DELETE] Direct cascading delete completed for demand ${id} and related matches.`);
    }

    res.status(200).json({
      message: "Demand deleted successfully",
      id,
    });
  } catch (error) {
    console.log("Delete Demand Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDemand,
  getAllDemands,
  getMyDemands,
  updateDemand,
  deleteDemand,
};