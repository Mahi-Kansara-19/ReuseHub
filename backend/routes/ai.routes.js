const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  analyzeListing,
  getRecommendation,
  shareContactWithBuyer,
} = require("../controllers/ai.controller");

const router = express.Router();

// Protected routes for AI insights
router.post("/analyze/:listingId", protect, analyzeListing);
router.get("/recommendation/:listingId", protect, getRecommendation);
router.post("/share-contact", protect, shareContactWithBuyer);

module.exports = router;
