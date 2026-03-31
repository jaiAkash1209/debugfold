const bcrypt = require("bcryptjs");
const { getMysql } = require("../src/config/mysql");

async function updateProfile(req, res, next) {
  try {
    const pool = getMysql();
    const { name, theme, password } = req.body;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await pool.query("UPDATE users SET name = ?, theme = ?, password = ? WHERE id = ?", [name, theme || "light", hashed, req.user.id]);
    } else {
      await pool.query("UPDATE users SET name = ?, theme = ? WHERE id = ?", [name, theme || "light", req.user.id]);
    }
    res.json({ message: "Profile updated" });
  } catch (error) {
    next(error);
  }
}

module.exports = { updateProfile };