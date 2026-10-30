
const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper: Calculate cart subtotal
const calculateSubtotal = (items) => {
    return items.reduce((total, item) => {
        if (item.product) {
            return total + item.product.price * item.quantity;
        }
        return total;
    }, 0);
};

// Helper: Get populated cart
const getPopulatedCart = async (userId) => {
    return await Cart.findOne({ user: userId })
        .populate(
            "items.product",
            "name price originalPrice image category stock"
        );
};


// 1. Add product to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }

        const product = await Product.findOne({
            _id: productId,
            isActive: true
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity is not available in stock"
            });
        }

        let cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock available"
                });
            }

            existingItem.quantity = newQuantity;

        } else {
            cart.items.push({
                product: productId,
                quantity: quantity
            });
        }

        await cart.save();

        const updatedCart = await getPopulatedCart(req.user._id);

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: updatedCart,
            subtotal: calculateSubtotal(updatedCart.items)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 2. Get logged-in user's cart
const getMyCart = async (req, res) => {
    try {
        let cart = await getPopulatedCart(req.user._id);

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Your cart is empty",
                cart: {
                    items: []
                },
                subtotal: 0
            });
        }

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart,
            subtotal: calculateSubtotal(cart.items)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 3. Update product quantity
const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const cartItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in your cart"
            });
        }

        const product = await Product.findOne({
            _id: productId,
            isActive: true
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product is no longer available"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity is not available in stock"
            });
        }

        cartItem.quantity = quantity;

        await cart.save();

        const updatedCart = await getPopulatedCart(req.user._id);

        res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            cart: updatedCart,
            subtotal: calculateSubtotal(updatedCart.items)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 4. Remove one product from cart
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const initialLength = cart.items.length;

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Product not found in your cart"
            });
        }

        await cart.save();

        const updatedCart = await getPopulatedCart(req.user._id);

        res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
            cart: updatedCart,
            subtotal: calculateSubtotal(updatedCart.items)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 5. Clear entire cart
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Your cart is already empty"
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart: {
                items: []
            },
            subtotal: 0
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addToCart,
    getMyCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
};
