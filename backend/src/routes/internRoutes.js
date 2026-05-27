const express = require("express");
const {
  getMyDashboard,
  getLeaderboard,
  getAnalytics,
} = require("../controllers/internController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyDashboard);
router.get("/leaderboard", protect, getLeaderboard);
router.get("/analytics", protect, getAnalytics);

module.exports = router;