
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getMyCart } from "../services/cartService";
import { createOrder } from "../services/orderService";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import {
    FaMapMarkerAlt,
    FaShoppingBag,
    FaCheckCircle,
    FaArrowRight,
    FaTruck,
    FaShieldAlt,
    FaBolt
} from "react-icons/fa";

function Checkout() {

    const { user, loading: authLoading } = useAuth();

    const { refreshCartCount } = useCart();

    const navigate = useNavigate();

    const location = useLocation();


    // Check whether user clicked Buy Now
    const directBuy = location.state?.directBuy === true;

    // Selected product for Buy Now
    const selectedProduct = location.state?.product || null;

    const directQuantity = Number(location.state?.quantity || 1);


    const [cartItems, setCartItems] = useState([]);

    const [subtotal, setSubtotal] = useState(0);

    const [loading, setLoading] = useState(true);

    const [placingOrder, setPlacingOrder] = useState(false);

    const [error, setError] = useState("");

    const [successOrder, setSuccessOrder] = useState(null);


    const [formData, setFormData] = useState({

        name: user?.name || "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India"

    });


    // Set logged-in user's name
    useEffect(() => {

        if (user?.name) {

            setFormData((previous) => ({

                ...previous,

                name: previous.name || user.name

            }));

        }

    }, [user]);


    // Load cart or direct product
    useEffect(() => {

        if (authLoading) return;

        if (!user) {

            setLoading(false);

            return;

        }


        // Direct Buy: use selected product
        if (directBuy) {

            if (!selectedProduct || !selectedProduct._id) {

                setError(
                    "Product selection not found. Please select a product again."
                );

                setCartItems([]);

                setSubtotal(0);

                setLoading(false);

                return;

            }


            if (directQuantity < 1 || directQuantity > Number(selectedProduct.stock)) {

                setError("Invalid product quantity or insufficient stock.");

                setCartItems([]);

                setSubtotal(0);

                setLoading(false);

                return;

            }


            const directItem = {

                product: selectedProduct,

                quantity: directQuantity

            };


            setCartItems([directItem]);

            setSubtotal(
                Number(selectedProduct.price) * directQuantity
            );

            setError("");

            setLoading(false);

            return;

        }


        // Normal Cart Checkout
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
                    "Unable to load cart."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchCart();

    }, [
        user,
        authLoading,
        directBuy,
        selectedProduct,
        directQuantity
    ]);


    // Update form fields
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // Place order
    const handlePlaceOrder = async (e) => {

        e.preventDefault();

        setError("");


        // Check selected products
        if (cartItems.length === 0) {

            setError(
                directBuy
                    ? "Please select a product again."
                    : "Your cart is empty. Please add products first."
            );

            return;

        }


        // Validate product selection
        if (directBuy && !selectedProduct?._id) {

            setError("Please select a valid product.");

            return;

        }


        // Validate name
        if (formData.name.trim().length < 3) {

            setError("Please enter a valid full name.");

            return;

        }


        // Validate address
        if (

            !formData.street.trim() ||
            !formData.city.trim() ||
            !formData.state.trim()

        ) {

            setError("Please complete your delivery address.");

            return;

        }


        // Validate mobile number
        if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {

            setError(
                "Please enter a valid 10-digit Indian mobile number."
            );

            return;

        }


        // Validate pincode
        if (!/^\d{6}$/.test(formData.pincode.trim())) {

            setError("Please enter a valid 6-digit pincode.");

            return;

        }


        try {

            setPlacingOrder(true);


            // Common delivery details
            const orderData = {

                name: formData.name.trim(),

                phone: formData.phone.trim(),

                street: formData.street.trim(),

                city: formData.city.trim(),

                state: formData.state.trim(),

                pincode: formData.pincode.trim(),

                country: formData.country.trim()

            };


            // Direct Buy Order
            if (directBuy) {

                orderData.items = [

                    {

                        productId: selectedProduct._id,

                        quantity: directQuantity

                    }

                ];

            }


            // Send order to backend
            // If directBuy = true, backend uses orderData.items
            // Otherwise, backend automatically uses logged-in user's cart
            const response = await createOrder(orderData);


            // Save successful order
            setSuccessOrder(response.order);


            // Refresh cart count
            // Direct Buy does not clear the existing cart
            await refreshCartCount();


        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Unable to place your order. Please try again."

            );

        } finally {

            setPlacingOrder(false);

        }

    };


    // Product image URL
    const getImageUrl = (image) => {

        if (!image) {

            return "https://placehold.co/200x200?text=ShopEase";

        }

        if (image.startsWith("http")) {

            return image;

        }

        return `http://localhost:5000${image.startsWith("/") ? "" : "/"}${image}`;

    };


    // Loading screen
    if (authLoading || loading) {

        return (

            <div className="text-center py-5">

                <div className="spinner-border text-success"></div>

                <p className="mt-3">
                    Loading checkout...
                </p>

            </div>

        );

    }


    // Login required
    if (!user) {

        return (

            <div className="checkout-empty">

                <FaShoppingBag className="checkout-empty-icon" />

                <h2>Please Login First</h2>

                <p>
                    Login to continue with your checkout.
                </p>

                <Link to="/login" className="btn checkout-main-btn">
                    Login Now
                </Link>

            </div>

        );

    }


    // Successful order confirmation
    if (successOrder) {

        return (

            <div className="order-success-page">

                <div className="order-success-card">

                    <FaCheckCircle className="success-icon" />

                    <h2>Order Placed Successfully!</h2>

                    <p>
                        Thank you for shopping with ShopEase.
                        Your order has been received.
                    </p>


                    <div className="success-order-details">

                        <div>

                            <span>Order ID</span>

                            <strong>
                                {successOrder._id}
                            </strong>

                        </div>


                        <div>

                            <span>Payment Method</span>

                            <strong>
                                Cash on Delivery
                            </strong>

                        </div>


                        <div>

                            <span>Order Status</span>

                            <strong>
                                {successOrder.orderStatus || "Pending"}
                            </strong>

                        </div>


                        <div>

                            <span>Total Amount</span>

                            <strong>
                                ₹{Number(
                                    successOrder.totalAmount || 0
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>

                    </div>


                    <button

                        type="button"

                        className="btn checkout-main-btn"

                        onClick={() => navigate("/my-orders")}

                    >

                        View My Orders

                    </button>


                    <button

                        type="button"

                        className="btn btn-outline-secondary mt-2"

                        onClick={() => navigate("/")}

                    >

                        Continue Shopping

                    </button>

                </div>

            </div>

        );

    }


    // Invalid direct product
    if (directBuy && !selectedProduct) {

        return (

            <div className="checkout-empty">

                <FaShoppingBag className="checkout-empty-icon" />

                <h2>Product Not Found</h2>

                <p>
                    Please select a product again to continue.
                </p>

                <Link to="/" className="btn checkout-main-btn">
                    Shop Now
                </Link>

            </div>

        );

    }


    // Empty cart (only for normal cart checkout)
    if (!directBuy && cartItems.length === 0) {

        return (

            <div className="checkout-empty">

                <FaShoppingBag className="checkout-empty-icon" />

                <h2>Your Cart is Empty</h2>

                <p>
                    Add some products before checkout.
                </p>

                <Link to="/" className="btn checkout-main-btn">
                    Shop Now
                </Link>

            </div>

        );

    }


    // Direct product selection error
    if (directBuy && error && cartItems.length === 0) {

        return (

            <div className="checkout-empty">

                <FaShoppingBag className="checkout-empty-icon" />

                <h2>Unable to Continue</h2>

                <p>{error}</p>

                <Link to="/" className="btn checkout-main-btn">
                    Select Product Again
                </Link>

            </div>

        );

    }


    return (

        <section className="checkout-page">

            <div className="container">


                {/* Page Heading */}
                <div className="checkout-heading">

                    <span>SHOPEASE CHECKOUT</span>

                    <h2>Complete Your Order</h2>

                    <p>

                        {directBuy

                            ? "You are buying this product directly."

                            : "Enter your delivery details and place your order."

                        }

                    </p>

                </div>


                {/* Checkout Type */}
                {directBuy && (

                    <div className="alert alert-success">

                        <FaBolt className="me-2" />

                        Direct Buy Checkout

                    </div>

                )}


                {/* Error Message */}
                {error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}


                <form onSubmit={handlePlaceOrder}>

                    <div className="row g-4">


                        {/* Delivery Address */}
                        <div className="col-lg-7">

                            <div className="checkout-form-card">

                                <h4>

                                    <FaMapMarkerAlt />

                                    Delivery Address

                                </h4>


                                {/* Full Name */}
                                <div className="mb-3">

                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input

                                        type="text"

                                        name="name"

                                        className="form-control"

                                        placeholder="Enter your full name"

                                        value={formData.name}

                                        onChange={handleChange}

                                        minLength="3"

                                        maxLength="60"

                                        required

                                    />

                                </div>


                                {/* Mobile Number */}
                                <div className="mb-3">

                                    <label className="form-label">
                                        Mobile Number
                                    </label>

                                    <input

                                        type="tel"

                                        name="phone"

                                        className="form-control"

                                        placeholder="10-digit mobile number"

                                        value={formData.phone}

                                        onChange={handleChange}

                                        maxLength="10"

                                        inputMode="numeric"

                                        required

                                    />

                                </div>


                                {/* Street Address */}
                                <div className="mb-3">

                                    <label className="form-label">
                                        Street Address
                                    </label>

                                    <textarea

                                        name="street"

                                        className="form-control"

                                        rows="3"

                                        placeholder="House number, street, area"

                                        value={formData.street}

                                        onChange={handleChange}

                                        required

                                    ></textarea>

                                </div>


                                {/* City and State */}
                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            City
                                        </label>

                                        <input

                                            type="text"

                                            name="city"

                                            className="form-control"

                                            placeholder="Enter city"

                                            value={formData.city}

                                            onChange={handleChange}

                                            required

                                        />

                                    </div>


                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            State
                                        </label>

                                        <input

                                            type="text"

                                            name="state"

                                            className="form-control"

                                            placeholder="Enter state"

                                            value={formData.state}

                                            onChange={handleChange}

                                            required

                                        />

                                    </div>

                                </div>


                                {/* Pincode and Country */}
                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Pincode
                                        </label>

                                        <input

                                            type="text"

                                            name="pincode"

                                            className="form-control"

                                            placeholder="6-digit pincode"

                                            value={formData.pincode}

                                            onChange={handleChange}

                                            maxLength="6"

                                            inputMode="numeric"

                                            required

                                        />

                                    </div>


                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Country
                                        </label>

                                        <input

                                            type="text"

                                            name="country"

                                            className="form-control"

                                            value={formData.country}

                                            onChange={handleChange}

                                            required

                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Payment Method */}
                            <div className="checkout-form-card payment-card">

                                <h4>

                                    <FaTruck />

                                    Payment Method

                                </h4>


                                <label className="cod-option">

                                    <input

                                        type="radio"

                                        name="paymentMethod"

                                        value="COD"

                                        checked

                                        readOnly

                                    />


                                    <span>

                                        <strong>
                                            Cash on Delivery (COD)
                                        </strong>

                                        <small>
                                            Pay when your order is delivered.
                                        </small>

                                    </span>


                                    <strong>COD</strong>

                                </label>

                            </div>

                        </div>


                        {/* Order Summary */}
                        <div className="col-lg-5">

                            <div className="checkout-summary">

                                <h4>

                                    {directBuy
                                        ? "Selected Product"
                                        : "Order Summary"
                                    }

                                </h4>


                                {/* Products */}
                                <div className="checkout-summary-items">

                                    {cartItems.map((item, index) => {

                                        const product = item.product;

                                        if (!product) return null;


                                        return (

                                            <div

                                                className="checkout-product"

                                                key={product._id || index}

                                            >

                                                <img

                                                    src={getImageUrl(product.image)}

                                                    alt={product.name}

                                                    onError={(e) => {

                                                        e.target.src =
                                                            "https://placehold.co/200x200?text=ShopEase";

                                                    }}

                                                />


                                                <div className="checkout-product-info">

                                                    <strong>
                                                        {product.name}
                                                    </strong>

                                                    <span>
                                                        Qty: {item.quantity}
                                                    </span>

                                                </div>


                                                <strong>

                                                    ₹{(

                                                        Number(product.price) *

                                                        Number(item.quantity)

                                                    ).toLocaleString("en-IN")}

                                                </strong>

                                            </div>

                                        );

                                    })}

                                </div>


                                {/* Price Details */}
                                <div className="checkout-price-row">

                                    <span>Subtotal</span>

                                    <strong>
                                        ₹{subtotal.toLocaleString("en-IN")}
                                    </strong>

                                </div>


                                <div className="checkout-price-row">

                                    <span>Shipping</span>

                                    <strong className="text-success">
                                        FREE
                                    </strong>

                                </div>


                                <div className="checkout-total-row">

                                    <span>Total Amount</span>

                                    <strong>
                                        ₹{subtotal.toLocaleString("en-IN")}
                                    </strong>

                                </div>


                                {/* Place Order Button */}
                                <button

                                    type="submit"

                                    className="btn checkout-place-btn"

                                    disabled={

                                        placingOrder ||

                                        cartItems.length === 0

                                    }

                                >

                                    {placingOrder ? (

                                        <>

                                            <span className="spinner-border spinner-border-sm"></span>

                                            Placing Order...

                                        </>

                                    ) : (

                                        <>

                                            {directBuy
                                                ? "Buy Now - Place Order"
                                                : "Place Order"
                                            }

                                            <FaArrowRight />

                                        </>

                                    )}

                                </button>


                                {/* Security Message */}
                                <p className="checkout-note">

                                    <FaShieldAlt />

                                    Secure checkout. Pay on delivery.

                                </p>

                            </div>

                        </div>

                    </div>

                </form>

            </div>

        </section>

    );

}

export default Checkout;
