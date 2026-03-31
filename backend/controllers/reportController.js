const path = require("path");
const Prescription = require("../models/Prescription");
const Report = require("../models/Report");
const { getMysql } = require("../src/config/mysql");

async function listReports(req, res, next) {
  try {
    let userIds = [req.user.id];

    if (req.user.role === "doctor") {
      const pool = getMysql();
      const [patients] = await pool.query(`SELECT DISTINCT patient_id FROM appointments WHERE doctor_id = ?`, [req.user.id]);
      userIds = patients.map((item) => item.patient_id);
    }

    if (req.user.role === "family") {
      const pool = getMysql();
      const [patients] = await pool.query("SELECT patient_id FROM family_links WHERE family_user_id = ?", [req.user.id]);
      userIds = patients.map((item) => item.patient_id);
    }

    let reports = await Report.find({ user_id: { $in: userIds } }).sort({ date: -1 }).lean();
    if (req.user.role === "doctor") {
      reports = reports.filter((report) => report.shared_with.includes(req.user.id));
    }
    res.json(reports);
  } catch (error) {
    next(error);
  }
}

async function uploadReport(req, res, next) {
  try {
    const userId = req.user.role === "doctor" ? Number(req.body.user_id) : req.user.id;
    const report = await Report.create({
      user_id: userId,
      uploaded_by: req.user.id,
      shared_with: req.body.shared_with ? req.body.shared_with.split(",").map(Number) : [],
      file_url: `/uploads/${path.basename(req.file.path)}`,
      file_name: req.file.originalname,
      description: req.body.description
    });
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
}

async function shareReport(req, res, next) {
  try {
    const { id } = req.params;
    const { doctor_id } = req.body;
    const report = await Report.findOne({ _id: id, user_id: req.user.id });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    if (!report.shared_with.includes(doctor_id)) {
      report.shared_with.push(doctor_id);
      await report.save();
    }
    res.json({ message: "Report shared with doctor" });
  } catch (error) {
    next(error);
  }
}

async function addPrescription(req, res, next) {
  try {
    const prescription = await Prescription.create({
      user_id: Number(req.body.user_id),
      doctor_id: req.user.id,
      medicine: req.body.medicine,
      dosage: req.body.dosage,
      timing: req.body.timing,
      notes: req.body.notes || ""
    });
    res.status(201).json(prescription);
  } catch (error) {
    next(error);
  }
}

async function listPrescriptions(req, res, next) {
  try {
    let filter = { user_id: req.user.id };
    if (req.user.role === "doctor" && req.query.user_id) {
      filter = { user_id: Number(req.query.user_id) };
    }
    const prescriptions = await Prescription.find(filter).sort({ created_at: -1 }).lean();
    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
}

module.exports = { addPrescription, listPrescriptions, listReports, shareReport, uploadReport };