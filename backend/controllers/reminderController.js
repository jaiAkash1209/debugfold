const { getMysql } = require("../src/config/mysql");

async function listReminders(req, res, next) {
  try {
    const pool = getMysql();
    const [rows] = await pool.query("SELECT id, medicine, dosage, timing, status FROM medicine_reminders WHERE user_id = ? ORDER BY id DESC", [req.user.id]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

async function createReminder(req, res, next) {
  try {
    const pool = getMysql();
    const { medicine, dosage, timing, status } = req.body;
    await pool.query("INSERT INTO medicine_reminders (user_id, medicine, dosage, timing, status) VALUES (?, ?, ?, ?, ?)", [req.user.id, medicine, dosage, timing, status || "upcoming"]);
    res.status(201).json({ message: "Medicine reminder added" });
  } catch (error) {
    next(error);
  }
}

module.exports = { createReminder, listReminders };