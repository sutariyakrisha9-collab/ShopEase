import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    FaEnvelope,
    FaLock,
    FaSignInAlt
} from "react-icons/fa";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const { email, password } = formData;

        if (!email.trim() || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            await login({
                email: email.trim(),
                password
            });

            navigate("/");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed. Please check your details."
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

                            {/* Heading */}
                            <div className="text-center mb-4">

                                <FaSignInAlt
                                    size={40}
                                    color="#123D32"
                                />

                                <h2 className="fw-bold mt-3">
                                    Welcome Back!
                                </h2>

                                <p className="text-muted">
                                    Login to your ShopEase account
                                </p>

                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

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
                                <div className="mb-4">

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
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    className="btn btn-success w-100 py-2"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Logging in..."
                                        : "Login"
                                    }

                                </button>

                            </form>

                            {/* Register Link */}
                            <div className="text-center mt-4">

                                <p className="mb-0">
                                    Don't have an account?{" "}

                                    <Link
                                        to="/register"
                                        className="fw-bold"
                                        style={{ color: "#123D32" }}
                                    >
                                        Register
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

export default Login;
