const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    unlocked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["intern", "admin"],
      default: "intern",
    },

    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    totalDonations: {
      type: Number,
      default: 0,
    },

    targetAmount: {
      type: Number,
      default: 20000,
    },

    tasksCompleted: {
      type: Number,
      default: 0,
    },

    totalTasks: {
      type: Number,
      default: 12,
    },

    rewards: {
      type: [rewardSchema],
      default: [
        { title: "Certificate", unlocked: false },
        { title: "Gift Card", unlocked: false },
        { title: "LinkedIn Recommendation", unlocked: false },
      ],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);