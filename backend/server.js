const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/upload");
const nseDataRoutes = require("./routes/nseData");

const app = express();

// =========================
// Middleware
// =========================
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// =========================
// Routes
// =========================
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/nse-data", nseDataRoutes);

// =========================
// Home Route
// =========================
app.get("/", (req, res) => {
  res.send("Welcome to OpenDB Manager API");
});

// =========================
// Test Database Connection
// =========================
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database Connected Successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database Connection Failed",
      error: error.message,
    });
  }
});

// =========================
// Server Start
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});