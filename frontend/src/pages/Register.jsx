import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

function Register() {

    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle registration
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const { name, email, password, confirmPassword } = formData;

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (name.trim().length < 3) {
            setError("Name must contain at least 3 characters.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const data = await register({
                name: name.trim(),
                email: email.trim(),
                password
            });

            setSuccess(data.message || "Registration successful!");

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-12 col-md-8 col-lg-5">

                    <div className="card shadow border-0">

                        <div className="card-body p-4 p-md-5">

                            <div className="text-center mb-4">

                                <FaUserPlus
                                    size={40}
                                    color="#123D32"
                                />

                                <h2 className="fw-bold mt-3">
                                    Create Account
                                </h2>

                                <p className="text-muted">
                                    Join ShopEase today!
                                </p>

                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="alert alert-success">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                {/* Name */}
                                <div className="mb-3">

                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <div className="input-group">

                                        <span className="input-group-text">
                                            <FaUser />
                                        </span>

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>

                                {/* Email */}
                                <div className="mb-3">

                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <div className="input-group">

                                        <span className="input-group-text">
                                            <FaEnvelope />
                                        </span>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>

                                {/* Password */}
                                <div className="mb-3">

                                    <label className="form-label">
                                        Password
                                    </label>

                                    <div className="input-group">

                                        <span className="input-group-text">
                                            <FaLock />
                                        </span>

                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            placeholder="Create password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>

                                {/* Confirm Password */}
                                <div className="mb-4">

                                    <label className="form-label">
                                        Confirm Password
                                    </label>

                                    <div className="input-group">

                                        <span className="input-group-text">
                                            <FaLock />
                                        </span>

                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>

                                {/* Register Button */}
                                <button
                                    type="submit"
                                    className="btn btn-success w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating Account..."
                                        : "Create Account"
                                    }
                                </button>

                            </form>

                            <div className="text-center mt-4">

                                <p className="mb-0">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="fw-bold"
                                        style={{ color: "#123D32" }}
                                    >
                                        Login
                                    </Link>
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;
