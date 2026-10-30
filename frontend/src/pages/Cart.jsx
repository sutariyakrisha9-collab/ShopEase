
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    getMyCart,
    updateCartQuantity,
    removeFromCart,
    clearMyCart
} from "../services/cartService";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import {
    FaShoppingBag,
    FaTrash,
    FaPlus,
    FaMinus,
    FaArrowRight,
    FaShoppingCart
} from "react-icons/fa";

function Cart() {
    const { user, loading: authLoading } = useAuth();
    const { refreshCartCount } = useCart();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    // Load cart from backend
    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyCart();

            setCartItems(data.cart?.items || []);
            setSubtotal(Number(data.subtotal || 0));

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load your cart."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchCart();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    // Update quantity
    const handleQuantityChange = async (productId, newQuantity, stock) => {
        if (newQuantity < 1) {
            return;
        }

        if (newQuantity > stock) {
            alert(`Only ${stock} items are available in stock.`);
            return;
        }

        try {
            setUpdating(true);

            const data = await updateCartQuantity(
                productId,
                newQuantity
            );

            setCartItems(data.cart?.items || []);
            setSubtotal(Number(data.subtotal || 0));

            await refreshCartCount();

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to update quantity."
            );
        } finally {
            setUpdating(false);
        }
    };

    // Remove product
    const handleRemove = async (productId) => {
        const confirmRemove = window.confirm(
            "Are you sure you want to remove this product?"
        );

        if (!confirmRemove) {
            return;
        }

        try {
            setUpdating(true);

            const data = await removeFromCart(productId);

            setCartItems(data.cart?.items || []);
            setSubtotal(Number(data.subtotal || 0));

            await refreshCartCount();

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to remove product."
            );
        } finally {
            setUpdating(false);
        }
    };

    // Clear complete cart
    const handleClearCart = async () => {
        const confirmClear = window.confirm(
            "Are you sure you want to clear your cart?"
        );

        if (!confirmClear) {
            return;
        }

        try {
            setUpdating(true);

            await clearMyCart();

            setCartItems([]);
            setSubtotal(0);

            await refreshCartCount();

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to clear cart."
            );
        } finally {
            setUpdating(false);
        }
    };

    // Product image URL
    const getImageUrl = (image) => {
        if (!image) {
            return "https://placehold.co/300x300?text=ShopEase";
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `http://localhost:5000${image.startsWith("/") ? "" : "/"}${image}`;
    };

    if (authLoading || loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success"></div>
                <p className="mt-3">Loading your cart...</p>
            </div>
        );
    }

    // Login required
    if (!user) {
        return (
            <div className="cart-empty-page">
                <FaShoppingCart className="empty-cart-icon" />

                <h2>Please Login First</h2>

                <p>
                    Login to view your shopping cart.
                </p>

                <Link to="/login" className="btn shop-btn">
                    Login Now
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center">
                    {error}
                </div>

                <div className="text-center">
                    <button
                        className="btn shop-btn"
                        onClick={fetchCart}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">

                {/* Page Heading */}
                <div className="cart-heading">
                    <div>
                        <h2>Shopping Cart</h2>

                        <p>
                            Review your selected products before checkout.
                        </p>
                    </div>

                    <span className="cart-item-total">
                        {cartItems.length} Products
                    </span>
                </div>

                {cartItems.length === 0 ? (

                    // Empty cart
                    <div className="cart-empty-page">
                        <FaShoppingBag className="empty-cart-icon" />

                        <h2>Your Cart is Empty</h2>

                        <p>
                            Looks like you haven't added anything to your cart yet.
                        </p>

                        <Link to="/" className="btn shop-btn">
                            Continue Shopping
                        </Link>
                    </div>

                ) : (

                    <div className="row g-4">

                        {/* Cart Products */}
                        <div className="col-lg-8">

                            <div className="cart-products-box">

                                <div className="cart-products-header">
                                    <h5>Your Products</h5>

                                    <button
                                        className="clear-cart-btn"
                                        onClick={handleClearCart}
                                        disabled={updating}
                                    >
                                        <FaTrash />
                                        Clear Cart
                                    </button>
                                </div>

                                {cartItems.map((item) => {
                                    const product = item.product;

                                    if (!product) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            className="cart-product-item"
                                            key={product._id}
                                        >

                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                className="cart-product-image"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://placehold.co/300x300?text=ShopEase";
                                                }}
                                            />

                                            <div className="cart-product-info">

                                                <span className="cart-category">
                                                    {product.category}
                                                </span>

                                                <h5>{product.name}</h5>

                                                <h6>
                                                    ₹{Number(product.price).toLocaleString("en-IN")}
                                                </h6>

                                                <p>
                                                    {product.stock > 0
                                                        ? `In Stock: ${product.stock}`
                                                        : "Out of Stock"}
                                                </p>

                                            </div>

                                            <div className="cart-quantity">

                                                <button
                                                    type="button"
                                                    disabled={updating || item.quantity <= 1}
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            product._id,
                                                            item.quantity - 1,
                                                            product.stock
                                                        )
                                                    }
                                                >
                                                    <FaMinus />
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        updating ||
                                                        item.quantity >= product.stock
                                                    }
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            product._id,
                                                            item.quantity + 1,
                                                            product.stock
                                                        )
                                                    }
                                                >
                                                    <FaPlus />
                                                </button>

                                            </div>

                                            <div className="cart-item-total-price">
                                                ₹{(
                                                    Number(product.price) *
                                                    Number(item.quantity)
                                                ).toLocaleString("en-IN")}
                                            </div>

                                            <button
                                                type="button"
                                                className="remove-cart-btn"
                                                disabled={updating}
                                                onClick={() =>
                                                    handleRemove(product._id)
                                                }
                                                title="Remove product"
                                            >
                                                <FaTrash />
                                            </button>

                                        </div>
                                    );
                                })}

                            </div>

                            <Link to="/" className="continue-shopping">
                                <FaArrowRight className="back-arrow" />
                                Continue Shopping
                            </Link>

                        </div>

                        {/* Order Summary */}
                        <div className="col-lg-4">

                            <div className="cart-summary">

                                <h4>Order Summary</h4>

                                <div className="summary-row">
                                    <span>Subtotal</span>

                                    <span>
                                        ₹{subtotal.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <div className="summary-row">
                                    <span>Shipping</span>

                                    <span className="free-shipping">
                                        FREE
                                    </span>
                                </div>

                                <div className="summary-row">
                                    <span>Payment Method</span>

                                    <span>Cash on Delivery</span>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-total">
                                    <span>Total Amount</span>

                                    <strong>
                                        ₹{subtotal.toLocaleString("en-IN")}
                                    </strong>
                                </div>

                               <button
                                    type="button"
                                    className="btn checkout-btn"
                                    disabled={updating}
                                    onClick={() => navigate("/checkout")}
                                >
                                    Proceed to Checkout
                                    <FaArrowRight />
                                </button>

                                <div className="secure-payment">
                                    <FaShoppingBag />
                                    Secure Shopping at ShopEase
                                </div>

                            </div>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

export default Cart;
