const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const records = await pool.query("SELECT COUNT(*) FROM records");
    const admins = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='Admin'"
    );
    const editors = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='Editor'"
    );

    res.json({
      totalUsers: users.rows[0].count,
      totalRecords: records.rows[0].count,
      totalAdmins: admins.rows[0].count,
      totalEditors: editors.rows[0].count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getDashboardStats,
}; 