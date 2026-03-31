const express = require("express");
const { addPrescription, listPrescriptions, listReports, shareReport, uploadReport } = require("../controllers/reportController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();
router.get("/", requireAuth, listReports);
router.post("/upload", requireAuth, requireRole(["patient", "doctor"]), upload.single("file"), uploadReport);
router.post("/share/:id", requireAuth, requireRole(["patient"]), shareReport);
router.get("/prescriptions", requireAuth, listPrescriptions);
router.post("/prescriptions", requireAuth, requireRole(["doctor"]), addPrescription);
module.exports = router;