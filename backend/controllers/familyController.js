const { getMysql } = require("../src/config/mysql");

async function linkFamilyMember(req, res, next) {
  try {
    const pool = getMysql();
    const { family_email, relationship_label } = req.body;
    const [rows] = await pool.query("SELECT id, role FROM users WHERE email = ?", [family_email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Family user not found" });
    }
    const familyUser = rows[0];
    if (familyUser.role !== "family") {
      return res.status(400).json({ message: "Linked account must be a family role" });
    }
    await pool.query("INSERT IGNORE INTO family_links (patient_id, family_user_id, relationship_label) VALUES (?, ?, ?)", [req.user.id, familyUser.id, relationship_label]);
    res.status(201).json({ message: "Family member linked" });
  } catch (error) {
    next(error);
  }
}

async function getFamilyLinks(req, res, next) {
  try {
    const pool = getMysql();
    const [rows] = await pool.query(`SELECT fl.id, fl.relationship_label, u.name, u.email FROM family_links fl JOIN users u ON u.id = fl.family_user_id WHERE fl.patient_id = ?`, [req.user.id]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

module.exports = { getFamilyLinks, linkFamilyMember };