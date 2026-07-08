const express = require("express");
const User = require("../models/User");
const WasteListing = require("../models/WasteListing");
const Demand = require("../models/Demand");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const colors = ["#4A7538", "#14B8A6", "#6366F1", "#F59E0B", "#EF4444", "#8B5CF6"];

const getNumber = (value) => {
  if (!value) return 0;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const buildMonthlyData = (items) => {
  const monthly = {};

  items.forEach((item) => {
    const date = item.createdAt ? new Date(item.createdAt) : new Date();
    const month = monthNames[date.getMonth()];
    const quantity = getNumber(item.quantity);

    if (!monthly[month]) {
      monthly[month] = {
        month,
        weight: 0,
        co2: 0,
      };
    }

    monthly[month].weight += quantity;
    monthly[month].co2 += Number((quantity * 0.44).toFixed(2));
  });

  return Object.values(monthly);
};

const buildCategoryData = (items) => {
  const categoryMap = {};

  items.forEach((item) => {
    const category = item.category || "Other";
    const quantity = getNumber(item.quantity);

    categoryMap[category] = (categoryMap[category] || 0) + quantity;
  });

  const total = Object.values(categoryMap).reduce((sum, value) => sum + value, 0);

  return Object.entries(categoryMap).map(([name, value], index) => ({
    name,
    value: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0,
    color: colors[index % colors.length],
  }));
};

router.get("/public", async (req, res) => {
  try {
    const businessesRegistered = await User.countDocuments();

    const listings = await WasteListing.find();

    const wasteReused = listings.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      return sum + qty;
    }, 0);

    const co2Saved = Number((wasteReused * 0.44).toFixed(2));

    res.json({
      businessesRegistered,
      wasteReused,
      co2Saved,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const user = req.user;
    const Match = require("../models/Match");

    console.log("[Analytics Endpoint] Called by user:", {
      _id: user ? user._id : undefined,
      email: user ? user.email : undefined,
      role: user ? user.role : undefined,
      accountType: user ? user.accountType : undefined
    });

    // 1. Calculate global platform-wide stats first so they are always available
    const acceptedMatchesGlobally = await Match.find({
      status: "accepted_by_supplier"
    }).populate("listing");

    const globalReusedQuantity = acceptedMatchesGlobally.reduce(
      (sum, match) => sum + (match.listing ? getNumber(match.listing.quantity) : 0),
      0
    );
    const globalCO2Saved = globalReusedQuantity * 0.44;

    if (user.accountType === "supplier") {
      const myListings = await WasteListing.find({
        owner: user._id,
      }).sort({
        createdAt: 1,
      });

      const totalQuantityListed = myListings.reduce(
        (sum, item) => sum + getNumber(item.quantity),
        0
      );

      // Real Reused Waste (Accepted Matches) for this supplier
      const acceptedSupplierMatches = await Match.find({
        supplier: user._id,
        status: "accepted_by_supplier"
      }).populate("listing");

      const totalReusedQuantity = acceptedSupplierMatches.reduce(
        (sum, match) => sum + (match.listing ? getNumber(match.listing.quantity) : 0),
        0
      );

      const totalCO2Saved = totalReusedQuantity * 0.44;

      const activeListings = myListings.filter(
        item => item.availability === "available"
      ).length;

      const responsePayload = {
        role: "supplier",
        title: "Supplier Analytics",
        listings: myListings,
        totalReusedQuantity,
        totalCO2Saved: Number(totalCO2Saved.toFixed(2)),
        globalReusedQuantity,
        globalCO2Saved: Number(globalCO2Saved.toFixed(2)),
        cards: {
          card1Label: "Real CO₂ Saved",
          card1Value: Number(totalCO2Saved.toFixed(2)),
          card1Unit: "kg",

          card2Label: "Real Waste Reused",
          card2Value: totalReusedQuantity,
          card2Unit: "kg",

          card3Label: "Active Listings",
          card3Value: activeListings,
          card3Unit: "",

          card4Label: "My Listings",
          card4Value: myListings.length,
          card4Unit: "",
        },
        monthlyData: buildMonthlyData(myListings),
        categoryData: buildCategoryData(myListings),
      };

      console.log("[Analytics Endpoint] Supplier JSON Response:", JSON.stringify(responsePayload, null, 2));
      return res.json(responsePayload);
    }

    if (user.accountType === "buyer") {
      const myDemands = await Demand.find({ buyer: user._id }).sort({
        createdAt: 1,
      });

      const totalQuantityRequested = myDemands.reduce((total, item) => {
        return total + getNumber(item.quantity);
      }, 0);

      // Real Reused Waste (Accepted Matches) for this buyer
      const acceptedBuyerMatches = await Match.find({
        buyer: user._id,
        status: "accepted_by_supplier"
      }).populate("listing");

      const totalReusedQuantity = acceptedBuyerMatches.reduce(
        (sum, match) => sum + (match.listing ? getNumber(match.listing.quantity) : 0),
        0
      );

      const totalCO2Saved = totalReusedQuantity * 0.44;

      const openDemands = myDemands.filter(
        (item) => item.status === "open" || !item.status
      ).length;

      const responsePayload = {
        role: "buyer",
        title: "Buyer Analytics",
        totalReusedQuantity,
        totalCO2Saved: Number(totalCO2Saved.toFixed(2)),
        globalReusedQuantity,
        globalCO2Saved: Number(globalCO2Saved.toFixed(2)),
        cards: {
          card1Label: "Real CO₂ Offloaded",
          card1Value: Number(totalCO2Saved.toFixed(2)),
          card1Unit: "kg",

          card2Label: "Real Waste Reused",
          card2Value: totalReusedQuantity,
          card2Unit: "kg",

          card3Label: "Open Demands",
          card3Value: openDemands,
          card3Unit: "",

          card4Label: "My Demands",
          card4Value: myDemands.length,
          card4Unit: "",
        },
        monthlyData: buildMonthlyData(myDemands),
        categoryData: buildCategoryData(myDemands),
      };

      console.log("[Analytics Endpoint] Buyer JSON Response:", JSON.stringify(responsePayload, null, 2));
      return res.json(responsePayload);
    }

    // Global / Platform Admin Analytics
    const registeredBusinesses = await User.countDocuments();
    const totalDemands = await Demand.countDocuments();
    const listings = await WasteListing.find();

    const totalWasteListed = listings.reduce((total, item) => {
      return total + (Number(item.quantity) || 0);
    }, 0);

    const responsePayload = {
      role: "global",
      title: "Platform Analytics",
      totalReusedQuantity: globalReusedQuantity,
      totalCO2Saved: Number(globalCO2Saved.toFixed(2)),
      globalReusedQuantity,
      globalCO2Saved: Number(globalCO2Saved.toFixed(2)),
      cards: {
        card1Label: "Total CO₂ Saved",
        card1Value: Number(globalCO2Saved.toFixed(2)),
        card1Unit: "kg",

        card2Label: "Total Waste Reused",
        card2Value: globalReusedQuantity,
        card2Unit: "kg",

        card3Label: "Total Demands",
        card3Value: totalDemands,
        card3Unit: "",

        card4Label: "Registered Businesses",
        card4Value: registeredBusinesses,
        card4Unit: "",
      },
      monthlyData: buildMonthlyData(listings),
      categoryData: buildCategoryData(listings),
    };

    console.log("[Analytics Endpoint] Global/Admin JSON Response:", JSON.stringify(responsePayload, null, 2));
    return res.json(responsePayload);
  } catch (error) {
    console.log("Analytics Error:", error);
    res.status(500).json({ message: error.message });
  }
});


const getAnalytics = async (req, res) => {
  try {
    const supplierId = req.user._id;

    const listings = await Listing.find({ userId: req.user._id });
    const matches = await Match.find({ supplierId });

    const totalCO2 = listings.reduce(
      (sum, l) => sum + (l.co2Saved || 0),
      0
    );

    res.json({
      cards: {
        card1Value: totalCO2,
        card2Value: listings.length,
        card3Value: matches.length,
      },
      monthlyData: [],
      categoryData: []
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = router;