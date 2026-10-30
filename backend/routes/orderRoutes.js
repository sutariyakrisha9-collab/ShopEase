const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelMyOrder,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect);

// User routes
router.post("/", createOrder);
router.get("/my-orders", getMyOrders);

// Admin routes - keep before /:id
router.get("/admin/all", adminOnly, getAllOrders);
router.patch("/admin/:id/status", adminOnly, updateOrderStatus);

// Individual order routes
router.patch("/:id/cancel", cancelMyOrder);
router.get("/:id", getOrderById);

module.exports = router;
