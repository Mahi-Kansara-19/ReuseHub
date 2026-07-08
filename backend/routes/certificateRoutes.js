const express = require("express");

const router = express.Router();

const {
  getCertificates,
  generateCertificate,
} = require("../controllers/certificateController");

const { protect } = require("../middleware/authMiddleware");

// Get all certificates of logged in user
router.get("/", protect, getCertificates);

// Generate certificate
router.post("/generate", protect, generateCertificate);

module.exports = router;