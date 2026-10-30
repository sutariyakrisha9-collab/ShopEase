const express = require("express");
const router = express.Router();

const {
    addToWishlist,
    getMyWishlist,
    removeFromWishlist,
    clearWishlist
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

// All Wishlist routes require login
router.use(protect);

router.post("/add", addToWishlist);

router.get("/", getMyWishlist);

router.delete("/clear", clearWishlist);

router.delete("/:productId", removeFromWishlist);

module.exports = router;
