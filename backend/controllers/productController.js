const Product = require("../models/Product");

// 1. Add Product (Admin only)
const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            originalPrice,
            category,
            image,
            stock,
            brand,
            featured
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            !category ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required product details"
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            originalPrice,
            category,
            image,
            stock,
            brand,
            featured
        });

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });

    } catch (error) {
        console.error("Add product error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to add product"
        });
    }
};


// 2. Get All Products with Search, Filter and Pagination
const getAllProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {
            isActive: true
        };

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            filter.category = {
                $regex: `^${category}$`,
                $options: "i"
            };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const currentPage = Math.max(1, Number(page) || 1);
        const perPage = Math.min(50, Math.max(1, Number(limit) || 10));

        let sortOption = { createdAt: -1 };

        if (sort === "price-low") {
            sortOption = { price: 1 };
        } else if (sort === "price-high") {
            sortOption = { price: -1 };
        } else if (sort === "newest") {
            sortOption = { createdAt: -1 };
        }

        const totalProducts = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        return res.status(200).json({
            success: true,
            totalProducts,
            currentPage,
            totalPages: Math.ceil(totalProducts / perPage),
            products
        });

    } catch (error) {
        console.error("Get products error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch products"
        });
    }
};


// 3. Get Single Product
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
};


// 4. Update Product (Admin only)
const updateProduct = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "description",
            "price",
            "originalPrice",
            "category",
            "image",
            "stock",
            "brand",
            "featured",
            "isActive"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one field to update"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("Update product error:", error.message);

        return res.status(400).json({
            success: false,
            message: "Unable to update product"
        });
    }
};


// 5. Delete Product (Admin only)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
};


module.exports = {
    addProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
};
