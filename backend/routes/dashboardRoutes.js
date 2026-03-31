const express = require("express");
const { getDoctorOverview, getPatientDashboard } = require("../controllers/dashboardController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/patient", requireAuth, requireRole(["patient"]), getPatientDashboard);
router.get("/doctor", requireAuth, requireRole(["doctor"]), getDoctorOverview);
module.exports = router;