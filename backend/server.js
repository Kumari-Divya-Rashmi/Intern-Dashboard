const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

const internData = {
  name: "John Doe",
  referralCode: "johndoe2025",
  totalDonations: 12345,
};

app.get("/api/intern", (req, res) => {
  
  res.json(internData);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
