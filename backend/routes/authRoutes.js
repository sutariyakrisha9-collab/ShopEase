
const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser,
    getMyProfile,
    updateMyProfile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");


// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Get My Profile
router.get("/me", protect, getMyProfile);

// Update My Profile
router.put("/update-profile", protect, updateMyProfile);


module.exports = router;
