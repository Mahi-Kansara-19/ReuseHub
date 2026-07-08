const mongoose = require("mongoose");

const aiRecommendationSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteListing",
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recommendedBuyers: [
      {
        buyerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        businessName: {
          type: String,
        },
        compatibility: {
          type: Number,
        },
        reasons: [String],
      }
    ],
    qualityScore: {
      type: Number,
    },
    suggestedPrice: {
      type: Number,
    },
    expectedRevenue: {
      type: Number,
    },
    carbonSaved: {
      type: Number,
    },
    impactScore: {
      type: Number,
    },
    confidence: {
      type: Number,
    },
    reasoning: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "AIRecommendations",
  }
);

// Virtual id for frontend compatibility
aiRecommendationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

module.exports = mongoose.model("AIRecommendation", aiRecommendationSchema);
