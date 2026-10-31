
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= GENERATE JWT TOKEN =================

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "1d" }
    );
};


// ================= COOKIE CONFIGURATION =================

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/"
};


// ================= REGISTER USER =================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password"
            });
        }

        if (name.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Name must contain at least 3 characters"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        const token = generateToken(user._id);

        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};


// ================= LOGIN USER =================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};


// ================= LOGOUT USER =================

const logoutUser = (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};


// ================= GET LOGGED-IN USER PROFILE =================

const getMyProfile = async (req, res) => {
    try {

        return res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                address: req.user.address,
                role: req.user.role
            }
        });

    } catch (error) {

        console.error("Get profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to get profile"
        });
    }
};


// ================= UPDATE USER PROFILE =================

const updateMyProfile = async (req, res) => {
    try {

        // Only allow these fields to be updated
        const { name, phone, address } = req.body;

        const updateData = {};

        // Validate and update name
        if (name !== undefined) {

            if (typeof name !== "string" || name.trim().length < 3) {
                return res.status(400).json({
                    success: false,
                    message: "Name must contain at least 3 characters"
                });
            }

            if (name.trim().length > 50) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot exceed 50 characters"
                });
            }

            updateData.name = name.trim();
        }


        // Validate and update phone
        if (phone !== undefined) {

            if (typeof phone !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Phone must be a string"
                });
            }

            if (phone && !/^[0-9]{10}$/.test(phone.trim())) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid 10-digit phone number"
                });
            }

            updateData.phone = phone.trim();
        }


        // Validate and update address
        if (address !== undefined) {

            if (
                typeof address !== "object" ||
                address === null ||
                Array.isArray(address)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid address format"
                });
            }

            const allowedAddressFields = [
                "street",
                "city",
                "state",
                "pincode",
                "country"
            ];

            const addressFields = {};

            for (const field of allowedAddressFields) {

                if (address[field] !== undefined) {

                    if (typeof address[field] !== "string") {
                        return res.status(400).json({
                            success: false,
                            message: `${field} must be a string`
                        });
                    }

                    addressFields[`address.${field}`] =
                        address[field].trim();
                }
            }

            Object.assign(updateData, addressFields);
        }


        // Check whether user sent any update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one field to update"
            });
        }


        // Update only the currently logged-in user's profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role
            }
        });

    } catch (error) {

        console.error("Update profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update profile"
        });
    }
};


// ================= EXPORT FUNCTIONS =================

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMyProfile,
    updateMyProfile
};
