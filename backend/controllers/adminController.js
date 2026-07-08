const User = require("../models/User");
const WasteListing = require("../models/WasteListing");
const Demand = require("../models/Demand");
const Match = require("../models/Match");

const getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments({
      role: { $ne: "admin" },
    });

    const buyers = await User.countDocuments({
      accountType: "buyer",
      role: { $ne: "admin" },
    });

    const suppliers = await User.countDocuments({
      accountType: "supplier",
      role: { $ne: "admin" },
    });

    const listings = await WasteListing.countDocuments();
    const requests = await Demand.countDocuments();

    res.status(200).json({
      users,
      buyers,
      suppliers,
      listings,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch admin stats",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: "admin" },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await User.findByIdAndDelete(userId);
    await WasteListing.deleteMany({ owner: userId });
    await Demand.deleteMany({ buyer: userId });
    await Match.deleteMany({ $or: [{ buyer: userId }, { supplier: userId }] });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
};