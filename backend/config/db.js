const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query(
  "SELECT current_database(), current_user, version()",
  (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Connected DB:", result.rows[0]);
    }
  }
);

module.exports = pool;