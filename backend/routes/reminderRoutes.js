const express = require("express");
const { createReminder, listReminders } = require("../controllers/reminderController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", requireAuth, requireRole(["patient"]), listReminders);
router.post("/", requireAuth, requireRole(["patient"]), createReminder);
module.exports = router;