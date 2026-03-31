const Report = require("../models/Report");
const Prescription = require("../models/Prescription");
const { getMysql } = require("../src/config/mysql");

async function getPatientDashboard(req, res, next) {
  try {
    const pool = getMysql();
    const [metrics] = await pool.query(`SELECT metric_date, blood_pressure, sugar_level, heart_rate FROM health_metrics WHERE user_id = ? ORDER BY metric_date DESC LIMIT 7`, [req.user.id]);
    const [appointments] = await pool.query(`SELECT a.id, a.date_time, a.reason, a.status, u.name AS doctor_name FROM appointments a JOIN users u ON a.doctor_id = u.id WHERE a.patient_id = ? ORDER BY a.date_time ASC LIMIT 5`, [req.user.id]);
    const [reminders] = await pool.query(`SELECT id, medicine, dosage, timing, status FROM medicine_reminders WHERE user_id = ? ORDER BY id DESC`, [req.user.id]);
    const reports = await Report.find({ user_id: req.user.id }).sort({ date: -1 }).limit(5).lean();
    const prescriptions = await Prescription.find({ user_id: req.user.id }).sort({ created_at: -1 }).limit(5).lean();
    res.json({ metrics, appointments, reminders, reports, prescriptions });
  } catch (error) {
    next(error);
  }
}

async function getDoctorOverview(req, res, next) {
  try {
    const pool = getMysql();
    const [appointments] = await pool.query(`SELECT a.id, a.date_time, a.reason, a.status, u.name AS patient_name, u.id AS patient_id FROM appointments a JOIN users u ON a.patient_id = u.id WHERE a.doctor_id = ? ORDER BY a.date_time ASC`, [req.user.id]);
    const uniquePatientIds = [...new Set(appointments.map((item) => item.patient_id))];
    const reports = await Report.find({ user_id: { $in: uniquePatientIds } }).sort({ date: -1 }).limit(10).lean();
    res.json({ appointments, recentReports: reports.filter((item) => item.shared_with.includes(req.user.id)) });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDoctorOverview, getPatientDashboard };