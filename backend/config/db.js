const { Pool } = require("pg");
require("dotenv").config();

console.log("__dirname:", __dirname);
console.log("cwd:", process.cwd());

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log(
  "DATABASE_URL starts with:",
  process.env.DATABASE_URL
    ? process.env.DATABASE_URL.substring(0, 25)
    : "undefined"
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;