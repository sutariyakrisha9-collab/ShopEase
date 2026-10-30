
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

// ==========================================
// 1. CREATE ORDER (Direct Buy + Cart Checkout)
// ==========================================

const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const {
            name,
            phone,
            street,
            city,
            state,
            pincode,
            country,
            items
        } = req.body;

        // Validate shipping address
        if (
            !name ||
            !phone ||
            !street ||
            !city ||
            !state ||
            !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide complete shipping address"
            });
        }

        // Direct Buy or Cart Checkout?
        const isDirectOrder = items !== undefined;

        if (isDirectOrder && (!Array.isArray(items) || items.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one product"
            });
        }

        let createdOrder;

        await session.withTransaction(async () => {

            let sourceItems = [];

            // DIRECT BUY
            if (isDirectOrder) {
                sourceItems = items;
            }

            // CART CHECKOUT
            else {
                const cart = await Cart.findOne({
                    user: req.user._id
                }).session(session);

                if (!cart || cart.items.length === 0) {
                    throw new Error("Your cart is empty");
                }

                sourceItems = cart.items.map((item) => ({
                    productId: item.product,
                    quantity: item.quantity
                }));
            }

            let orderItems = [];
            let totalAmount = 0;

            // Process every product
            for (const item of sourceItems) {

                const { productId, quantity } = item;

                // Validate product ID
                if (!mongoose.isValidObjectId(productId)) {
                    throw new Error("Invalid product ID");
                }

                // Validate quantity
                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1
                ) {
                    throw new Error("Invalid product quantity");
                }

                // Find product
                const product = await Product.findOne({
                    _id: productId,
                    isActive: true
                }).session(session);

                if (!product) {
                    throw new Error("Product not found");
                }

                // Check stock
                if (product.stock < quantity) {
                    throw new Error(
                        `Only ${product.stock} items available for ${product.name}`
                    );
                }

                // Reduce product stock safely
                const stockUpdate = await Product.updateOne(
                    {
                        _id: product._id,
                        isActive: true,
                        stock: { $gte: quantity }
                    },
                    {
                        $inc: { stock: -quantity }
                    },
                    { session }
                );

                if (stockUpdate.modifiedCount !== 1) {
                    throw new Error(
                        `Insufficient stock for ${product.name}`
                    );
                }

                // Calculate total using database price
                const itemTotal = product.price * quantity;

                totalAmount += itemTotal;

                // Save product details in order
                orderItems.push({
                    product: product._id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    quantity: quantity
                });
            }

            // Create order
            const orders = await Order.create(
                [
                    {
                        user: req.user._id,

                        items: orderItems,

                        totalAmount: totalAmount,

                        shippingAddress: {
                            name,
                            phone,
                            street,
                            city,
                            state,
                            pincode,
                            country: country || "India"
                        },

                        paymentMethod: "COD",
                        paymentStatus: "Pending",
                        orderStatus: "Pending"
                    }
                ],
                { session }
            );

            createdOrder = orders[0];

            // Clear cart only after Cart Checkout
            // Direct Buy will not clear existing cart
            if (!isDirectOrder) {
                await Cart.updateOne(
                    { user: req.user._id },
                    { $set: { items: [] } },
                    { session }
                );
            }
        });

        return res.status(201).json({
            success: true,
            message: isDirectOrder
                ? "Direct order placed successfully"
                : "Order placed successfully",

            order: createdOrder
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    } finally {
        await session.endSession();
    }
};


// ==========================================
// 2. GET MY ORDERS
// ==========================================

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// 3. GET SINGLE ORDER
// ==========================================

const getOrderById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate("items.product", "name image price");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// 4. CANCEL MY ORDER
// ==========================================

const cancelMyOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        let cancelledOrder;

        await session.withTransaction(async () => {

            const order = await Order.findOne({
                _id: req.params.id,
                user: req.user._id
            }).session(session);

            if (!order) {
                throw new Error("Order not found");
            }

            if (
                !["Pending", "Confirmed"].includes(order.orderStatus)
            ) {
                throw new Error(
                    "This order cannot be cancelled"
                );
            }

            // Restore product stock
            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stock: item.quantity } },
                    { session }
                );
            }

            order.orderStatus = "Cancelled";

            await order.save({ session });

            cancelledOrder = order;
        });

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order: cancelledOrder
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });

    } finally {
        await session.endSession();
    }
};


// ==========================================
// 5. GET ALL ORDERS (ADMIN ONLY)
// ==========================================

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// 6. UPDATE ORDER STATUS (ADMIN ONLY)
// ==========================================

const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled order cannot be updated"
            });
        }

        const allowedOrderStatuses = [
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered"
        ];

        const allowedPaymentStatuses = [
            "Pending",
            "Paid"
        ];

        if (orderStatus !== undefined) {
            if (!allowedOrderStatuses.includes(orderStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid order status"
                });
            }

            order.orderStatus = orderStatus;
        }

        if (paymentStatus !== undefined) {
            if (!allowedPaymentStatuses.includes(paymentStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment status"
                });
            }

            order.paymentStatus = paymentStatus;
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelMyOrder,
    getAllOrders,
    updateOrderStatus
};
