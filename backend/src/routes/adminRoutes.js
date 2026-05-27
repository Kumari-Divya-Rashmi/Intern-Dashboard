const express = require("express");

const {
  getAllInterns,
  updateDonation,
  updateReward,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/interns", getAllInterns);
router.patch("/interns/:id/donation", updateDonation);
router.patch("/interns/:id/reward", updateReward);

module.exports = router;