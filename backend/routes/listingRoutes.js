const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createListing,
  getAllListings,
  getMyListings,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");

const router = express.Router();

// Public routes for reading listings, protected route for creating
router
  .route("/")
  .get(getAllListings)
  .post(protect, createListing);

// Protected route to read own listings
router.get("/my", protect, getMyListings);

// Protected routes to update and delete listings
router
  .route("/:id")
  .put(protect, updateListing)
  .delete(protect, deleteListing);

module.exports = router;
