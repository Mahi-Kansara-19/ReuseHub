const express = require("express");
const router = express.Router();

const Listing = require("../models/WasteListing"); // ✅ FIXED
const Match = require("../models/Match");

const {
  getAdminStats,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");

// USERS
router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// LISTINGS
router.get("/listings", async (req, res) => {
  try {
    const listings = await Listing.find().lean();
    res.json(listings);
  } catch (err) {
    console.log("LISTINGS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/listings/:id", async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/listings/:id", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MATCHES
router.get("/matches", async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("buyer", "businessName")
      .populate("supplier", "businessName");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/matches/:id", async (req, res) => {
  try {
    const updated = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/matches/:id", async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: "Match deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI ANALYST LIVE DATABASE QUERY ENDPOINT
router.post("/ai-analyst", async (req, res) => {
  try {
    const { query } = req.body;
    
    // Fetch live data directly from MongoDB database
    const User = require("../models/User");
    const WasteListing = require("../models/WasteListing");
    const Match = require("../models/Match");
    const Demand = require("../models/Demand");

    const totalListingsCount = await WasteListing.countDocuments();
    const listings = await WasteListing.find().lean();
    
    const totalQuantity = listings.reduce((sum, l) => {
      const qty = parseFloat(l.quantity);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0);

    const totalCO2 = (totalQuantity * 0.44).toFixed(2);

    const matches = await Match.find().populate("listing").lean();
    const completedTransactions = matches.filter(m => m.status === "accepted_by_supplier");
    const totalDemandsCount = await Demand.countDocuments();

    // Group materials dynamically from database
    const materialCounts = {};
    listings.forEach(l => {
      const name = l.name?.trim().toLowerCase() || "other";
      const qty = parseFloat(l.quantity);
      materialCounts[name] = (materialCounts[name] || 0) + (isNaN(qty) ? 0 : qty);
    });

    const topMaterials = Object.entries(materialCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, qty]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        quantity: qty
      }));

    res.json({
      success: true,
      totalListings: totalListingsCount,
      totalQuantity,
      totalCO2,
      completedTransactionsCount: completedTransactions.length,
      activeDemands: totalDemandsCount,
      topMaterials,
      dateGenerated: new Date().toLocaleString()
    });

  } catch (error) {
    console.error("AI Analyst Endpoint Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;