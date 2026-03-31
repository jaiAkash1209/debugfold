const express = require("express");
const { updateProfile } = require("../controllers/settingsController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();
router.put("/", requireAuth, updateProfile);
module.exports = router;