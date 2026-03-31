const express = require("express");
const { handleChat } = require("../controllers/chatbotController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", requireAuth, handleChat);
module.exports = router;