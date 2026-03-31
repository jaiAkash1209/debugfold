const express = require("express");
const { getFamilyLinks, linkFamilyMember } = require("../controllers/familyController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", requireAuth, requireRole(["patient"]), getFamilyLinks);
router.post("/", requireAuth, requireRole(["patient"]), linkFamilyMember);
module.exports = router;