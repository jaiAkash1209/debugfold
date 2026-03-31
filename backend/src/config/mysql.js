const mysql = require("mysql2/promise");

let pool;

async function initializeMysql() {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "caresync",
    waitForConnections: true,
    connectionLimit: 10
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      role ENUM('patient', 'doctor', 'family') NOT NULL,
      email VARCHAR(180) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      theme VARCHAR(20) DEFAULT 'light',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      specialization VARCHAR(120) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      doctor_id INT NOT NULL,
      date_time DATETIME NOT NULL,
      reason VARCHAR(255) NOT NULL,
      status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS health_metrics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      metric_date DATE NOT NULL,
      blood_pressure VARCHAR(20) NOT NULL,
      sugar_level VARCHAR(20) NOT NULL,
      heart_rate INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS medicine_reminders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      medicine VARCHAR(120) NOT NULL,
      dosage VARCHAR(80) NOT NULL,
      timing VARCHAR(80) NOT NULL,
      status ENUM('upcoming', 'taken', 'missed') DEFAULT 'upcoming',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS family_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      family_user_id INT NOT NULL,
      relationship_label VARCHAR(80) NOT NULL,
      UNIQUE KEY unique_family_link (patient_id, family_user_id),
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (family_user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}

function getMysql() {
  if (!pool) {
    throw new Error("MySQL pool has not been initialized");
  }

  return pool;
}

module.exports = { getMysql, initializeMysql };