const User = require("../models/User");
const Donation = require("../models/Donation");

exports.getAllInterns = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    const query = {
      role: "intern",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { referralCode: { $regex: search, $options: "i" } },
      ],
    };

    const interns = await User.find(query)
      .select("-password")
      .sort({ totalDonations: -1 });

    res.status(200).json({
      success: true,
      count: interns.length,
      data: interns,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateDonation = async (req, res, next) => {
  try {
    const { amount, note } = req.body;

    if (amount === undefined || Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid donation amount is required",
      });
    }

    const intern = await User.findOne({
      _id: req.params.id,
      role: "intern",
    });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found",
      });
    }

    const previousAmount = intern.totalDonations || 0;
    const newAmount = Number(amount);
    const changeAmount = newAmount - previousAmount;

    intern.totalDonations = newAmount;
    await intern.save();

    await Donation.create({
      intern: intern._id,
      updatedBy: req.user._id,
      previousAmount,
      newAmount,
      changeAmount,
      note: note || "Donation updated by admin",
    });

    res.status(200).json({
      success: true,
      message: "Donation updated successfully",
      data: intern,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReward = async (req, res, next) => {
  try {
    const { rewardTitle, unlocked } = req.body;

    const intern = await User.findOne({
      _id: req.params.id,
      role: "intern",
    });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found",
      });
    }

    const reward = intern.rewards.find(
      (item) => item.title.toLowerCase() === rewardTitle.toLowerCase()
    );

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Reward not found",
      });
    }

    reward.unlocked = unlocked;
    await intern.save();

    res.status(200).json({
      success: true,
      message: "Reward updated successfully",
      data: intern,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const totalInterns = await User.countDocuments({ role: "intern" });

    const interns = await User.find({ role: "intern" })
      .select("name email referralCode totalDonations targetAmount rewards")
      .sort({ totalDonations: -1 });

    const totalDonations = interns.reduce(
      (sum, intern) => sum + (intern.totalDonations || 0),
      0
    );

    const averageDonation =
      totalInterns === 0 ? 0 : Math.round(totalDonations / totalInterns);

    const topInterns = interns.slice(0, 5).map((intern) => ({
      name: intern.name,
      totalDonations: intern.totalDonations || 0,
      targetAmount: intern.targetAmount || 0,
    }));

    const donationHistory = await Donation.find()
      .populate("intern", "name")
      .sort({ createdAt: 1 });

    const donationTrend = donationHistory.map((item) => ({
      date: item.createdAt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      internName: item.intern?.name || "Unknown",
      newAmount: item.newAmount,
      changeAmount: item.changeAmount,
    }));

    const rewardStats = {
      unlocked: 0,
      locked: 0,
    };

    interns.forEach((intern) => {
      intern.rewards.forEach((reward) => {
        if (reward.unlocked) {
          rewardStats.unlocked += 1;
        } else {
          rewardStats.locked += 1;
        }
      });
    });

    res.status(200).json({
      success: true,
      data: {
        totalInterns,
        totalDonations,
        averageDonation,
        topInterns,
        donationTrend,
        rewardStats,
      },
    });
  } catch (error) {
    next(error);
  }
};