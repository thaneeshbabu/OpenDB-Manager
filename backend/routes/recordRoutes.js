const express = require("express");
const router = express.Router();

const { createRecord , getRecords, updateRecord, deleteRecord } = require("../controllers/recordController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");


console.log("createRecord:", createRecord);
console.log("getRecords:", getRecords);
console.log("updateRecord:", updateRecord);
console.log("deleteRecord:", deleteRecord);

console.log("verifyToken:", verifyToken);
console.log("authorizeRole:", authorizeRole);

// Create Record
router.post(
    "/",
    verifyToken,
    authorizeRole("Admin", "Editor"),
    createRecord
);

router.get(
    "/",
    verifyToken,
    getRecords
);

router.put(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "Editor"),
    updateRecord
);

router.delete(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    deleteRecord
);

module.exports = router;