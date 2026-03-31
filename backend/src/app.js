const cors = require("cors");
const express = require("express");
const path = require("path");

const authRoutes = require("../routes/authRoutes");
const appointmentRoutes = require("../routes/appointmentRoutes");
const dashboardRoutes = require("../routes/dashboardRoutes");
const reportRoutes = require("../routes/reportRoutes");
const reminderRoutes = require("../routes/reminderRoutes");
const familyRoutes = require("../routes/familyRoutes");
const chatbotRoutes = require("../routes/chatbotRoutes");
const settingsRoutes = require("../routes/settingsRoutes");

const app = express();
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "CareSync API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/settings", settingsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

module.exports = app;