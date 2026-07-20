const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();
const userRoutes = require("./routes/userRoutes");

const recordRoutes = require("./routes/recordRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");



app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to OpenDB Manager API");
});

// Test Database Connection
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "Database Connected Successfully",
            time: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Database Connection Failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});