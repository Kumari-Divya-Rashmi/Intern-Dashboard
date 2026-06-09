const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    intern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    previousAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    newAmount: {
      type: Number,
      required: true,
    },

    changeAmount: {
      type: Number,
      required: true,
    },

    note: {
      type: String,
      default: "Donation updated by admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);