const express = require("express");
const router = express.Router();
const pool = require("../config/db");

console.log("✅ nseData route loaded");

// ================= GET ALL DATA =================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM nse_data ORDER BY date1 DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ================= UPDATE ROW =================
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const {
    symbol,
    series,
    open_price,
    high_price,
    low_price,
    close_price,
    last_price,
    prev_close,
    total_traded_qty,
    total_traded_value,
    date1,
  } = req.body;

  try {
    await pool.query(
      `UPDATE nse_data
       SET symbol=$1,
           series=$2,
           open_price=$3,
           high_price=$4,
           low_price=$5,
           close_price=$6,
           last_price=$7,
           prev_close=$8,
           total_traded_qty=$9,
           total_traded_value=$10,
           date1=$11
       WHERE id=$12`,
      [
        symbol,
        series,
        open_price,
        high_price,
        low_price,
        close_price,
        last_price,
        prev_close,
        total_traded_qty,
        total_traded_value,
        date1,
        id,
      ]
    );

    res.json({ message: "Updated Successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ================= DELETE ROW =================
router.delete("/:id", async (req, res) => {
  try {

    await pool.query(
      "DELETE FROM nse_data WHERE id=$1",
      [req.params.id]
    );

    res.json({
      message: "Deleted Successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;