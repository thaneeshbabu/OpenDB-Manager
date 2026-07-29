const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const pool = require("../config/db");
const format = require("pg-format");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Clean text values
function clean(value) {
  if (value === undefined || value === null) return null;

  const v = String(value).trim();

  if (v === "" || v === "-") return null;

  return v;
}

// Clean numeric values
function cleanNumber(value) {
  if (value === undefined || value === null) return null;

  const v = String(value).trim().replace(/,/g, "");

  if (v === "" || v === "-") return null;

  const num = Number(v);

  return isNaN(num) ? null : num;
}

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim(),
        })
      )
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          console.log(`Rows Read: ${results.length}`);

          const batchSize = 500;

          for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);

            const values = batch.map((row) => [
              clean(row.SYMBOL),
              clean(row.SERIES),
              clean(row.DATE1),

              cleanNumber(row.PREV_CLOSE),
              cleanNumber(row.OPEN_PRICE),
              cleanNumber(row.HIGH_PRICE),
              cleanNumber(row.LOW_PRICE),
              cleanNumber(row.LAST_PRICE),
              cleanNumber(row.CLOSE_PRICE),
              cleanNumber(row.AVG_PRICE),

              cleanNumber(row.TTL_TRD_QNTY),
              cleanNumber(row.TURNOVER_LACS),
              cleanNumber(row.NO_OF_TRADES),
              cleanNumber(row.DELIV_QTY),
              cleanNumber(row.DELIV_PER),
            ]);

            const query = format(
              `
              INSERT INTO nse_data
              (
                symbol,
                series,
                date1,
                prev_close,
                open_price,
                high_price,
                low_price,
                last_price,
                close_price,
                avg_price,
                ttl_trd_qnty,
                turnover_lacs,
                no_of_trades,
                deliv_qty,
                deliv_per
              )
              VALUES %L
              `,
              values
            );

            await pool.query(query);

            console.log(
              `Inserted ${Math.min(i + batchSize, results.length)} rows`
            );
          }

          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            totalRecords: results.length,
            message: `${results.length} records imported successfully`,
          });
        } catch (err) {
          console.error("Database Error:", err);

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