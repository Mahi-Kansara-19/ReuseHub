const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    demand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Demand",
      required: false,
    },
    demandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Demand",
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteListing",
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteListing",
    },

    // AI generated matching percentage
    matchScore: {
      type: Number,
      required: true,
    },

    // Why AI suggested this match
    matchReason: {
      type: [String],
      default: [],
    },

    // Match workflow status
    status: {
      type: String,
      enum: [
        "new",
        "pending",
        "accepted_by_supplier",
        "rejected"
      ],
      default: "new",
    },

    // Optional deal completion details
    dealDate: {
      type: Date,
    },

    // Stores messages/notes between supplier and buyer later
    conversation: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Automatic pre-save mapping to guarantee both sets of reference fields are identical
matchSchema.pre("save", function () {
  if (this.buyer && !this.buyerId) this.buyerId = this.buyer;
  if (this.supplier && !this.supplierId) this.supplierId = this.supplier;
  if (this.demand && !this.demandId) this.demandId = this.demand;
  if (this.listing && !this.listingId) this.listingId = this.listing;
});

// Frontend compatibility
matchSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports = mongoose.model("Match", matchSchema);