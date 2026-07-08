const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  name: String,
  quantity: String,
  price: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("ListingModel", listingSchema);