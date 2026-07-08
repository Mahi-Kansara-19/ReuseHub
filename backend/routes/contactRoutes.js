const express = require("express");
const router = express.Router();
const ContactInquiry = require("../models/ContactInquiry");
const Feedback = require("../models/Feedback");

// @desc    Submit a contact inquiry question
// @route   POST /api/contact/inquiry
router.post("/inquiry", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const inquiry = await ContactInquiry.create({ name, email, subject, message });
    res.status(201).json({ success: true, data: inquiry, message: "Inquiry submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Submit user feedback with emojis
// @route   POST /api/contact/feedback
router.post("/feedback", async (req, res) => {
  try {
    const { emoji, comment, userId } = req.body;
    if (!emoji) {
      return res.status(400).json({ success: false, message: "Emoji rating is required" });
    }

    const feedback = await Feedback.create({
      emoji,
      comment: comment || "",
      user: userId || null,
    });
    res.status(201).json({ success: true, data: feedback, message: "Feedback submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
