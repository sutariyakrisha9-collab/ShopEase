
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrders, cancelOrder } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

import {
    FaBoxOpen,
    FaShoppingBag,
    FaMapMarkerAlt,
    FaTimesCircle,
    FaRedo
} from "react-icons/fa";

function MyOrders() {
    const { user, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    // Load logged-in user's orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyOrders();

            setOrders(data.orders || []);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load your orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setOrders([]);
            setLoading(false);
            return;
        }

        fetchOrders();
    }, [user, authLoading]);

    // Format date
    const formatDate = (date) => {
        if (!date) return "Date not available";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // Format price
    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("en-IN");
    };

    // Get product image
    const getImageUrl = (image) => {
        if (!image) {
            return "https://placehold.co/200x200?text=ShopEase";
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `http://localhost:5000${image.startsWith("/") ? "" : "/"}${image}`;
    };

    // Get status CSS class
    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "status-delivered";

            case "Cancelled":
                return "status-cancelled";

            case "Shipped":
                return "status-shipped";

            case "Confirmed":
                return "status-confirmed";

            default:
                return "status-pending";
        }
    };

    // Cancel order
    const handleCancelOrder = async (orderId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmCancel) return;

        try {
            setCancellingId(orderId);
            setError("");

            await cancelOrder(orderId);

            alert("Your order has been cancelled successfully.");

            await fetchOrders();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to cancel this order."
            );
        } finally {
            setCancellingId(null);
        }
    };

    // Wait for authentication
    if (authLoading || loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success"></div>
                <p className="mt-3">Loading your orders...</p>
            </div>
        );
    }

    // Login required
    if (!user) {
        return (
            <div className="my-orders-empty">
                <FaShoppingBag className="my-orders-empty-icon" />

                <h2>Please Login First</h2>

                <p>Login to view your orders.</p>

                <Link to="/login" className="btn orders-shop-btn">
                    Login Now
                </Link>
            </div>
        );
    }

    return (
        <section className="my-orders-page">
            <div className="container">

                {/* Page Heading */}
                <div className="my-orders-heading">
                    <span>SHOPEASE ACCOUNT</span>

                    <h2>My Orders</h2>

                    <p>
                        Track and manage all your ShopEase orders.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {/* Refresh Button */}
                <div className="orders-toolbar">
                    <p>
                        Total Orders: <strong>{orders.length}</strong>
                    </p>

                    <button
                        type="button"
                        className="btn orders-refresh-btn"
                        onClick={fetchOrders}
                    >
                        <FaRedo />
                        Refresh
                    </button>
                </div>

                {/* Empty Orders */}
                {orders.length === 0 ? (
                    <div className="my-orders-empty">

                        <FaBoxOpen className="my-orders-empty-icon" />

                        <h3>No Orders Yet</h3>

                        <p>
                            You have not placed any orders yet.
                            Start shopping today!
                        </p>

                        <Link to="/" className="btn orders-shop-btn">
                            <FaShoppingBag />
                            Start Shopping
                        </Link>

                    </div>
                ) : (

                    <div className="orders-list">

                        {orders.map((order) => {
                            const address = order.shippingAddress || {};

                            return (
                                <div
                                    className="order-card"
                                    key={order._id}
                                >

                                    {/* Order Header */}
                                    <div className="order-card-header">

                                        <div>
                                            <span>ORDER ID</span>

                                            <strong>
                                                #{order._id}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>ORDER DATE</span>

                                            <strong>
                                                {formatDate(order.createdAt)}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>TOTAL AMOUNT</span>

                                            <strong className="order-amount">
                                                ₹{formatPrice(order.totalAmount)}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>ORDER STATUS</span>

                                            <strong
                                                className={`order-status ${getStatusClass(order.orderStatus)}`}
                                            >
                                                {order.orderStatus || "Pending"}
                                            </strong>
                                        </div>

                                    </div>

                                    {/* Order Products */}
                                    <div className="order-card-body">

                                        <h5>
                                            <FaShoppingBag />
                                            Ordered Products
                                        </h5>

                                        {order.items?.map((item, index) => (
                                            <div
                                                className="my-order-product"
                                                key={item._id || index}
                                            >

                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.name || "Product"}
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://placehold.co/200x200?text=ShopEase";
                                                    }}
                                                />

                                                <div className="my-order-product-info">

                                                    <strong>
                                                        {item.name || "Product"}
                                                    </strong>

                                                    <span>
                                                        Quantity: {item.quantity}
                                                    </span>

                                                    <span>
                                                        Price: ₹{formatPrice(item.price)}
                                                    </span>

                                                </div>

                                                <strong className="my-order-item-total">
                                                    ₹{formatPrice(
                                                        Number(item.price) *
                                                        Number(item.quantity)
                                                    )}
                                                </strong>

                                            </div>
                                        ))}

                                    </div>

                                    {/* Delivery Address */}
                                    <div className="order-address">

                                        <h5>
                                            <FaMapMarkerAlt />
                                            Delivery Address
                                        </h5>

                                        <p>
                                            {address.name || "Customer"}
                                            {", "}
                                            {address.street}
                                            {", "}
                                            {address.city}
                                            {", "}
                                            {address.state}
                                            {" - "}
                                            {address.pincode}
                                            {", "}
                                            {address.country}
                                        </p>

                                    </div>

                                    {/* Payment Details */}
                                    <div className="order-payment-details">

                                        <div>
                                            <span>Payment Method</span>
                                            <strong>
                                                {order.paymentMethod || "COD"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Payment Status</span>
                                            <strong>
                                                {order.paymentStatus || "Pending"}
                                            </strong>
                                        </div>

                                    </div>

                                    {/* Order Actions */}
                                    <div className="order-card-footer">

                                        <span className="order-thank-you">
                                            Thank you for shopping with ShopEase!
                                        </span>

                                        {(
                                            order.orderStatus === "Pending" ||
                                            order.orderStatus === "Confirmed"
                                        ) && (
                                            <button
                                                type="button"
                                                className="btn cancel-order-btn"
                                                disabled={cancellingId === order._id}
                                                onClick={() => handleCancelOrder(order._id)}
                                            >
                                                <FaTimesCircle />

                                                {cancellingId === order._id
                                                    ? "Cancelling..."
                                                    : "Cancel Order"}
                                            </button>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </section>
    );
}

export default MyOrders;
