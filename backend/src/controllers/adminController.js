const User = require("../models/User");

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
    const { amount } = req.body;

    if (amount === undefined || amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid donation amount is required",
      });
    }

    const intern = await User.findOneAndUpdate(
      { _id: req.params.id, role: "intern" },
      { totalDonations: amount },
      { new: true, runValidators: true }
    ).select("-password");

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found",
      });
    }

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