const Certificate = require("../models/Certificate");
const WasteListing = require("../models/WasteListing");

// Helper function to parse quantity in kg, handling units like Tons, MT, etc.
const parseQuantityInKg = (quantity, unit) => {
  if (!quantity) return 0;
  const str = String(quantity).trim();
  const unitCombined = `${unit || ""} ${str}`.toLowerCase();
  
  const num = parseFloat(str.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return 0;
  
  if (unitCombined.includes("ton") || unitCombined.includes("mt") || unitCombined.includes("tonne")) {
    return num * 1000;
  }
  return num;
};

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
      totalWaste += parseQuantityInKg(listing.quantity, listing.unit);
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
        existingCertificate.issuedDate = new Date();
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
      totalWaste += parseQuantityInKg(listing.quantity, listing.unit);
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
      existingCertificate.totalWaste = totalWaste;
      existingCertificate.issuedDate = new Date();
      await existingCertificate.save();

      const populatedCert = await existingCertificate.populate("user", "businessName ownerName");
      return res.status(200).json({
        success: true,
        message: `Certificate updated successfully with latest total waste (${totalWaste} kg).`,
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