const mongoose = require("mongoose");

const wasteListingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, "Quantity is required"],
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Price is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    availability: {
      type: String,
      default: "available",
      enum: ["available", "pending", "sold"],
    },
    image: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone contact is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email contact is required"],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner reference is required"],
    },
    businessName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to virtual id for frontend compatibility
wasteListingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports = mongoose.model("WasteListing", wasteListingSchema);
