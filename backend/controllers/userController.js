const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await pool.query(
            `INSERT INTO users(name, email, password, role)
             VALUES($1, $2, $3, $4)`,
            [name, email, hashedPassword, role]
        );

        res.status(201).json({
            message: "User Registered Successfully"
        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }
};

// Login User
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
    {
        id: user.id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};