const Certificate = require("../models/Certificate");
const WasteListing = require("../models/WasteListing");

/*
--------------------------------------------------------
GET ALL CERTIFICATES OF LOGGED-IN USER
GET /api/certificates
--------------------------------------------------------
*/
const getCertificates = async (req, res) => {
  try {
    // Fetch all waste listings of logged in supplier
    const listings = await WasteListing.find({
      owner: req.user._id,
    });

    // Calculate total waste
    let totalWaste = 0;
    listings.forEach((listing) => {
      // Convert quantity string into number
      const qty = parseFloat(
        String(listing.quantity).replace(/[^\d.]/g, "")
      );
      if (!isNaN(qty)) {
        totalWaste += qty;
      }
    });

    if (totalWaste < 5000) {
      // If user's total waste has dropped below 5000 kg, delete any existing certificates
      await Certificate.deleteMany({
        user: req.user._id,
      });
    } else {
      // If user is eligible, check if certificate exists and update totalWaste if it changed
      const existingCertificate = await Certificate.findOne({
        user: req.user._id,
      });
      if (existingCertificate && existingCertificate.totalWaste !== totalWaste) {
        existingCertificate.totalWaste = totalWaste;
        await existingCertificate.save();
      }
    }

    const certificates = await Certificate.find({
      user: req.user._id,
    })
      .populate("user", "businessName ownerName")
      .sort({ createdAt: -1 });

    res.status(200).json(certificates);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch certificates",
    });
  }
};

/*
--------------------------------------------------------
GENERATE CERTIFICATE
POST /api/certificates/generate
--------------------------------------------------------
*/
const generateCertificate = async (req, res) => {
  try {
    // Get all waste listings of logged in supplier
    const listings = await WasteListing.find({
      owner: req.user._id,
    });

    // Calculate total waste
    let totalWaste = 0;

    listings.forEach((listing) => {
      // Convert quantity string into number
      // Works for "20", "20kg", "20 kg"
      const qty = parseFloat(
        String(listing.quantity).replace(/[^\d.]/g, "")
      );

      if (!isNaN(qty)) {
        totalWaste += qty;
      }
    });

    // Check eligibility
    if (totalWaste < 5000) {
      return res.status(400).json({
        success: false,
        message: `You have listed only ${totalWaste} kg of waste. Minimum 5000 kg is required to earn a certificate. Please list more waste to reach 5000+ kg.`,
      });
    }

    const existingCertificate = await Certificate.findOne({
      user: req.user._id,
    });

    if (existingCertificate) {
      if (existingCertificate.totalWaste !== totalWaste) {
        existingCertificate.totalWaste = totalWaste;
        await existingCertificate.save();
      }
      const populatedCert = await existingCertificate.populate("user", "businessName ownerName");
      return res.status(200).json({
        success: true,
        message: "Certificate already exists.",
        certificate: populatedCert,
      });
    }

    // Generate unique certificate number
    const certificateNumber =
      "CERT-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    // Save certificate
    let certificate = await Certificate.create({
      user: req.user._id,
      totalWaste,
      certificateNumber,
    });

    certificate = await certificate.populate("user", "businessName ownerName");

    res.status(201).json({
      success: true,
      message: "Certificate generated successfully.",
      certificate,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error generating certificate.",
    });
  }
};

module.exports = {
  getCertificates,
  generateCertificate,
};