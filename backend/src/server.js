// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");

// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const internRoutes = require("./routes/internRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const { errorHandler } = require("./middleware/errorMiddleware");

// dotenv.config();

// connectDB();

// const app = express();

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Intern Dashboard API is running",
//   });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/intern", internRoutes);
// app.use("/api/admin", adminRoutes);

// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const internRoutes = require("./routes/internRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

/* -------------------- Database Connection -------------------- */

connectDB();

/* -------------------- CORS Configuration -------------------- */

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, mobile apps, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* -------------------- Middlewares -------------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- Health Check Route -------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Intern Dashboard API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

/* -------------------- API Routes -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/intern", internRoutes);
app.use("/api/admin", adminRoutes);

/* -------------------- 404 Handler -------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* -------------------- Global Error Handler -------------------- */

app.use((error, req, res, next) => {
  console.error("Server Error:", error.message);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

/* -------------------- Start Server -------------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});