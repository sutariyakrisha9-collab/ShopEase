const mongoose = require("mongoose");

const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// 1. Add product to Wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
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

        let wishlist = await Wishlist.findOne({
            user: req.user._id
        });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user._id,
                products: []
            });
        }

        // Check if product already exists
        const alreadyExists = wishlist.products.some(
            id => id.toString() === productId
        );

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Product is already in your Wishlist"
            });
        }

        wishlist.products.push(productId);

        await wishlist.save();

        const updatedWishlist = await Wishlist.findOne({
            user: req.user._id
        }).populate(
            "products",
            "name price originalPrice image category stock"
        );

        res.status(200).json({
            success: true,
            message: "Product added to Wishlist successfully",
            wishlist: updatedWishlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 2. Get logged-in user's Wishlist
const getMyWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user._id
        }).populate(
            "products",
            "name price originalPrice image category stock"
        );

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                message: "Your Wishlist is empty",
                wishlist: {
                    products: []
                }
            });
        }

        res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 3. Remove one product from Wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const wishlist = await Wishlist.findOne({
            user: req.user._id
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        const initialLength = wishlist.products.length;

        wishlist.products = wishlist.products.filter(
            id => id.toString() !== productId
        );

        if (wishlist.products.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Product not found in your Wishlist"
            });
        }

        await wishlist.save();

        const updatedWishlist = await Wishlist.findOne({
            user: req.user._id
        }).populate(
            "products",
            "name price originalPrice image category stock"
        );

        res.status(200).json({
            success: true,
            message: "Product removed from Wishlist successfully",
            wishlist: updatedWishlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 4. Clear entire Wishlist
const clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user._id
        });

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                message: "Your Wishlist is already empty"
            });
        }

        wishlist.products = [];

        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Wishlist cleared successfully",
            wishlist: {
                products: []
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addToWishlist,
    getMyWishlist,
    removeFromWishlist,
    clearWishlist
};
