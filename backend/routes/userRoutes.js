// const express = require("express");
// const router = express.Router();


// // Import Controller
// const { registerUser, loginUser } = require("../controllers/userController");

// // Register Route
// router.post("/register", registerUser);
// router.post("/login", loginUser);

// module.exports = router;

// const express = require("express");
// const router = express.Router();

// const { registerUser } = require("../controllers/userController");

// router.post("/register", registerUser);

// // Comment this line temporarily
// // router.post("/login", loginUser);

// module.exports = router;

const express = require("express");
const router = express.Router();


const {
    registerUser,
    loginUser
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, (req, res) => {

    res.json({
        message: "Welcome to your profile",
        user: req.user
    });

});

router.get(
    "/admin",
    verifyToken,
    authorizeRole("Admin"),
    (req, res) => {

        res.json({
            message: "Welcome Admin"
        });

    }
);

router.get(
    "/editor",
    verifyToken,
    authorizeRole("Admin", "Editor"),
    (req, res) => {

        res.json({
            message: "Welcome Editor"
        });

    }
);

router.get(
    "/viewer",
    verifyToken,
    authorizeRole("Admin", "Editor", "Viewer"),
    (req, res) => {

        res.json({
            message: "Welcome Viewer"
        });

    }
);

module.exports = router;