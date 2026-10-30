const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    uploadProductImage
} = require("../controllers/uploadController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

// Admin-only image upload
router.post(
    "/",
    protect,
    adminOnly,
    upload.single("image"),
    uploadProductImage
);

module.exports = router;