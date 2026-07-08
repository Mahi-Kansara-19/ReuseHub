const express = require("express");
const router = express.Router();

const User = require("../models/User");
const WasteListing = require("../models/WasteListing");
const Match = require("../models/Match");

const getNumber = (value) => {
  if (!value) return 0;
  return parseFloat(String(value).replace(/[^\d.]/g, "")) || 0;
};

router.get("/", async (req, res) => {
  try {
    const businessesRegistered = await User.countDocuments();

    const acceptedMatches = await Match.find({
      status: "accepted_by_supplier",
    }).populate("listing");

    let wasteReused = 0;

    acceptedMatches.forEach((match) => {
      if (match.listing) {
        wasteReused += getNumber(match.listing.quantity);
      }
    });

    const co2Saved = Number((wasteReused * 0.44).toFixed(2));

    res.json({
      businessesRegistered,
      wasteReused,
      co2Saved,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;