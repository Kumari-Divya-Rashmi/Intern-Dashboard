const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const interns = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Frontend Intern",
    referralCode: "JOHN2025",
    totalDonations: 12345,
    targetAmount: 20000,
    tasksCompleted: 8,
    totalTasks: 12,
    rank: 2,
    rewards: [
      { title: "Certificate", unlocked: true },
      { title: "Gift Card", unlocked: true },
      { title: "LinkedIn Recommendation", unlocked: false },
    ],
  },
];

const leaderboard = [
  { id: 1, name: "Aarav Sharma", totalDonations: 18500 },
  { id: 2, name: "John Doe", totalDonations: 12345 },
  { id: 3, name: "Priya Singh", totalDonations: 9700 },
];

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Intern Dashboard API is running",
  });
});

app.get("/api/intern/:id", (req, res) => {
  const internId = Number(req.params.id);
  const intern = interns.find((item) => item.id === internId);

  if (!intern) {
    return res.status(404).json({
      success: false,
      message: "Intern not found",
    });
  }

  res.json({
    success: true,
    data: intern,
  });
});

app.get("/api/leaderboard", (req, res) => {
  res.json({
    success: true,
    data: leaderboard,
  });
});

app.post("/api/donations", (req, res) => {
  const { internId, amount } = req.body;

  if (!internId || !amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Intern ID and valid donation amount are required",
    });
  }

  const intern = interns.find((item) => item.id === Number(internId));

  if (!intern) {
    return res.status(404).json({
      success: false,
      message: "Intern not found",
    });
  }

  intern.totalDonations += Number(amount);

  res.status(201).json({
    success: true,
    message: "Donation added successfully",
    data: intern,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});