const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const pool = require("../config/db");

const router = express.Router();

// Configure file upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload CSV route
router.post("/", upload.single("file"), async (req, res) => {
     console.log("✅ Upload route hit");
  try {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          for (const row of results) {
            await pool.query(
              `INSERT INTO nse_data
              (symbol, series, date1, prev_close, open_price,
               high_price, low_price, last_price, close_price,
               avg_price, ttl_trd_qnty, turnover_lacs,
               no_of_trades, deliv_qty, deliv_per)
              VALUES
              ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
              [
                row.SYMBOL,
                row.SERIES,
                row.DATE1,
                row.PREV_CLOSE,
                row.OPEN_PRICE,
                row.HIGH_PRICE,
                row.LOW_PRICE,
                row.LAST_PRICE,
                row.CLOSE_PRICE,
                row.AVG_PRICE,
                row.TTL_TRD_QNTY,
                row.TURNOVER_LACS,
                row.NO_OF_TRADES,
                row.DELIV_QTY,
                row.DELIV_PER,
              ]
            );
          }

          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            message: `${results.length} records imported successfully`,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            success: false,
            message: err.message,
          });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;