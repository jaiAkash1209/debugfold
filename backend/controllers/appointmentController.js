const { getMysql } = require("../src/config/mysql");

async function createAppointment(req, res, next) {
  try {
    const pool = getMysql();
    const patientId = req.user.role === "patient" ? req.user.id : Number(req.body.patient_id);
    const { doctor_id, date_time, reason } = req.body;
    await pool.query("INSERT INTO appointments (patient_id, doctor_id, date_time, reason) VALUES (?, ?, ?, ?)", [patientId, doctor_id, date_time, reason]);
    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    next(error);
  }
}

async function getAppointments(req, res, next) {
  try {
    const pool = getMysql();
    let query = `
      SELECT a.id, a.patient_id, a.doctor_id, a.date_time, a.reason, a.status,
             patient.name AS patient_name, doctor.name AS doctor_name
      FROM appointments a
      JOIN users patient ON a.patient_id = patient.id
      JOIN users doctor ON a.doctor_id = doctor.id
    `;
    const params = [];

    if (req.user.role === "patient") {
      query += " WHERE a.patient_id = ?";
      params.push(req.user.id);
    } else if (req.user.role === "doctor") {
      query += " WHERE a.doctor_id = ?";
      params.push(req.user.id);
    } else if (req.user.role === "family") {
      query += " JOIN family_links fl ON fl.patient_id = a.patient_id WHERE fl.family_user_id = ?";
      params.push(req.user.id);
    }

    query += " ORDER BY a.date_time ASC";
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

async function updateAppointmentStatus(req, res, next) {
  try {
    const pool = getMysql();
    const { id } = req.params;
    const { status } = req.body;
    const [result] = await pool.query("UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?", [status, id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment updated" });
  } catch (error) {
    next(error);
  }
}

async function getDoctors(req, res, next) {
  try {
    const pool = getMysql();
    const [rows] = await pool.query(`
      SELECT u.id, u.name, u.email, d.specialization
      FROM users u
      JOIN doctors d ON d.user_id = u.id
      ORDER BY u.name ASC
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

module.exports = { createAppointment, getAppointments, getDoctors, updateAppointmentStatus };