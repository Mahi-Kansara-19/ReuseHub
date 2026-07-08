const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    emoji: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
