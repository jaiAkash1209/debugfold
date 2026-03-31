const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getMysql } = require("../src/config/mysql");

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}

async function seedPatientData(userId) {
  const pool = getMysql();
  await pool.query(
    `INSERT INTO health_metrics (user_id, metric_date, blood_pressure, sugar_level, heart_rate)
     VALUES (?, CURDATE(), '120/80', '98 mg/dL', 72), (?, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '118/78', '101 mg/dL', 74), (?, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '122/82', '95 mg/dL', 70)`,
    [userId, userId, userId]
  );
  await pool.query(
    `INSERT INTO medicine_reminders (user_id, medicine, dosage, timing, status)
     VALUES (?, 'Metformin', '500mg', '08:00 AM', 'upcoming'), (?, 'Vitamin D', '1 tablet', '09:00 PM', 'taken')`,
    [userId, userId]
  );
}

async function signup(req, res, next) {
  try {
    const pool = getMysql();
    const { name, email, password, role, specialization } = req.body;
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query("INSERT INTO users (name, role, email, password) VALUES (?, ?, ?, ?)", [name, role, email, hashedPassword]);

    if (role === "doctor") {
      await pool.query("INSERT INTO doctors (user_id, specialization) VALUES (?, ?)", [result.insertId, specialization || "General Physician"]);
    }
    if (role === "patient") {
      await seedPatientData(result.insertId);
    }

    const user = { id: result.insertId, name, email, role };
    res.status(201).json({ token: signToken(user), user });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const pool = getMysql();
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role, theme: user.theme } });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const pool = getMysql();
    const [rows] = await pool.query("SELECT id, name, email, role, theme FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

module.exports = { login, me, signup };