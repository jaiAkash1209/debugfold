const express = require("express");
const { body } = require("express-validator");
const { createAppointment, getAppointments, getDoctors, updateAppointmentStatus } = require("../controllers/appointmentController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { handleValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/doctors", requireAuth, getDoctors);
router.get("/", requireAuth, getAppointments);
router.post("/", requireAuth, requireRole(["patient", "family"]), [body("doctor_id").isInt(), body("date_time").notEmpty(), body("reason").trim().notEmpty()], handleValidation, createAppointment);
router.patch("/:id/status", requireAuth, requireRole(["doctor"]), [body("status").isIn(["accepted", "rejected"])], handleValidation, updateAppointmentStatus);

module.exports = router;