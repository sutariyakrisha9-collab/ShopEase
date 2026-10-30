const express = require("express");
const router = express.Router();

const {
    addToCart,
    getMyCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// All cart routes require login
router.use(protect);

router.post("/add", addToCart);

router.get("/", getMyCart);

router.patch("/:productId", updateCartQuantity);

// Keep /clear before /:productId
router.delete("/clear", clearCart);

router.delete("/:productId", removeFromCart);

module.exports = router;
