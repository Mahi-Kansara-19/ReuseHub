const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  createDemand,
  getAllDemands,
  getMyDemands,
  updateDemand,
  deleteDemand,
} = require("../controllers/demandController");

const router = express.Router();

router.route("/").get(getAllDemands).post(protect, createDemand);

router.get("/my", protect, getMyDemands);

router.route("/:id").put(protect, updateDemand).delete(protect, deleteDemand);

module.exports = router;