const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    // Supplier who earned the certificate
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Total recycled quantity at the time of generation
    totalWaste: {
      type: Number,
      required: true,
    },

    // Unique certificate ID
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // Certificate title
    title: {
      type: String,
      default: "Sustainability Certificate",
    },

    // Optional achievement text
    achievement: {
      type: String,
      default:
        "Awarded for successfully recycling more than 5000 kg of industrial waste through ReuseHub.",
    },

    // Date issued
    issuedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual id for frontend
certificateSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

module.exports = mongoose.model("Certificate", certificateSchema);