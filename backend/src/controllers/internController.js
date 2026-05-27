const User = require("../models/User");

exports.getMyDashboard = async (req, res, next) => {
  try {
    const intern = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      data: intern,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.find({ role: "intern" })
      .select("name referralCode totalDonations targetAmount")
      .sort({ totalDonations: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const totalInterns = await User.countDocuments({ role: "intern" });

    const donationStats = await User.aggregate([
      { $match: { role: "intern" } },
      {
        $group: {
          _id: null,
          totalDonations: { $sum: "$totalDonations" },
          averageDonation: { $avg: "$totalDonations" },
          highestDonation: { $max: "$totalDonations" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalInterns,
        totalDonations: donationStats[0]?.totalDonations || 0,
        averageDonation: Math.round(donationStats[0]?.averageDonation || 0),
        highestDonation: donationStats[0]?.highestDonation || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};