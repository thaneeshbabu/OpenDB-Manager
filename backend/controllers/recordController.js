const pool = require("../config/db");

// Create Record
const createRecord = async (req, res) => {
    try {

        const { title, description, category } = req.body;

        const created_by = req.user.id;

        await pool.query(
            `INSERT INTO records (title, description, category, created_by)
             VALUES ($1, $2, $3, $4)`,
            [title, description, category, created_by]
        );

        res.status(201).json({
            message: "Record Created Successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

const getRecords = async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM records ORDER BY id ASC"
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

const updateRecord = async (req, res) => {
    try {

        const { id } = req.params;
        const { title, description, category } = req.body;

        await pool.query(
            `UPDATE records
             SET title = $1,
                 description = $2,
                 category = $3
             WHERE id = $4`,
            [title, description, category, id]
        );

        res.json({
            message: "Record Updated Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

const deleteRecord = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM records WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Record Not Found"
            });
        }

        res.json({
            message: "Record Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

console.log({
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord
});

module.exports = {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord
};