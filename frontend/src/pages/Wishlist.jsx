
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaHeart,
    FaShoppingCart,
    FaTrash,
    FaArrowLeft
} from "react-icons/fa";

import {
    getMyWishlist,
    removeFromWishlist,
    clearWishlist
} from "../services/wishlistService";

import { addToCart } from "../services/cartService";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";


function Wishlist() {

    const { user, loading: authLoading } = useAuth();

    const { refreshCartCount } = useCart();

    const { refreshWishlistCount } = useWishlist();

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [processingId, setProcessingId] = useState(null);

    const [clearing, setClearing] = useState(false);


    // Product image URL
    const getImageUrl = (image) => {

        if (!image) {
            return "https://placehold.co/400x300?text=ShopEase";
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `http://localhost:5000${image.startsWith("/") ? "" : "/"}${image}`;

    };


    // Fetch logged-in user's wishlist
    const fetchWishlist = async () => {

        try {

            setLoading(true);

            setError("");

            const data = await getMyWishlist();

            const wishlistProducts =
                data.wishlist?.products ||
                data.products ||
                data.wishlist?.items ||
                [];

            const formattedProducts = wishlistProducts
                .map((item) => item.product || item)
                .filter((product) => product && product._id);

            setProducts(formattedProducts);

        } catch (err) {

            console.error("Wishlist loading error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load wishlist."
            );

        } finally {

            setLoading(false);

        }

    };


    // Load wishlist after login
    useEffect(() => {

        if (authLoading) return;

        if (!user) {

            setProducts([]);

            setLoading(false);

            return;

        }

        fetchWishlist();

    }, [user, authLoading]);


    // Remove product from wishlist
    const handleRemove = async (productId) => {

        try {

            setProcessingId(productId);

            await removeFromWishlist(productId);

            setProducts((previous) =>
                previous.filter(
                    (product) => product._id !== productId
                )
            );

            await refreshWishlistCount();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to remove product from wishlist."
            );

        } finally {

            setProcessingId(null);

        }

    };


    // Add wishlist product to cart
    const handleAddToCart = async (productId) => {

        try {

            setProcessingId(productId);

            await addToCart(productId, 1);

            await refreshCartCount();

            alert("Product added to cart successfully!");

        } catch (err) {

            if (err.response?.status === 401) {

                alert("Please login before adding products to cart.");

                navigate("/login");

            } else {

                alert(
                    err.response?.data?.message ||
                    "Unable to add product to cart."
                );

            }

        } finally {

            setProcessingId(null);

        }

    };


    // Clear complete wishlist
    const handleClearWishlist = async () => {

        const confirmClear = window.confirm(
            "Are you sure you want to clear your complete wishlist?"
        );

        if (!confirmClear) return;

        try {

            setClearing(true);

            await clearWishlist();

            setProducts([]);

            await refreshWishlistCount();

            alert("Wishlist cleared successfully!");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Unable to clear wishlist."
            );

        } finally {

            setClearing(false);

        }

    };


    // Wait for authentication
    if (authLoading || loading) {

        return (

            <div className="text-center py-5">

                <div className="spinner-border text-success"></div>

                <p className="mt-3">
                    Loading your wishlist...
                </p>

            </div>

        );

    }


    // Login required
    if (!user) {

        return (

            <div className="wishlist-empty">

                <FaHeart className="wishlist-empty-icon" />

                <h2>Please Login First</h2>

                <p>
                    Login to view your personal wishlist.
                </p>

                <Link to="/login" className="btn wishlist-main-btn">
                    Login Now
                </Link>

            </div>

        );

    }


    return (

        <section className="wishlist-page">

            <div className="container">

                {/* Heading */}

                <div className="wishlist-heading">

                    <span>SHOPEASE COLLECTION</span>

                    <h2>
                        <FaHeart className="me-2" />
                        My Wishlist
                    </h2>

                    <p>
                        Your favourite products are saved here.
                    </p>

                </div>


                {/* Error Message */}

                {error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}


                {/* Wishlist Toolbar */}

                {products.length > 0 && (

                    <div className="wishlist-toolbar">

                        <p>
                            {products.length} Favourite Product(s)
                        </p>

                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={handleClearWishlist}
                            disabled={clearing}
                        >

                            <FaTrash className="me-2" />

                            {clearing ? "Clearing..." : "Clear Wishlist"}

                        </button>

                    </div>

                )}


                {/* Empty Wishlist */}

                {products.length === 0 ? (

                    <div className="wishlist-empty">

                        <FaHeart className="wishlist-empty-icon" />

                        <h3>Your Wishlist is Empty</h3>

                        <p>
                            You haven't saved any favourite products yet.
                        </p>

                        <Link to="/" className="btn wishlist-main-btn">

                            <FaArrowLeft className="me-2" />

                            Explore Products

                        </Link>

                    </div>

                ) : (

                    /* Wishlist Products */

                    <div className="row g-4">

                        {products.map((product) => (

                            <div
                                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                                key={product._id}
                            >

                                <div className="card h-100 shadow-sm wishlist-product-card">

                                    {/* Product Image */}

                                    <div className="wishlist-image-wrapper">

                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className="card-img-top"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://placehold.co/400x300?text=ShopEase";
                                            }}
                                        />

                                        <span className="wishlist-heart">
                                            <FaHeart />
                                        </span>

                                    </div>


                                    {/* Product Details */}

                                    <div className="card-body d-flex flex-column">

                                        <span className="text-muted small mb-2">
                                            {product.category}
                                        </span>

                                        <h5 className="card-title">
                                            {product.name}
                                        </h5>

                                        <h5 className="text-success fw-bold">
                                            ₹{Number(product.price).toLocaleString("en-IN")}
                                        </h5>


                                        {/* Stock */}

                                        <p className="text-muted small">

                                            {product.stock > 0
                                                ? `In Stock: ${product.stock}`
                                                : "Out of Stock"
                                            }

                                        </p>


                                        {/* Add to Cart */}

                                        <button
                                            type="button"
                                            className="btn btn-success mb-2"
                                            disabled={
                                                product.stock <= 0 ||
                                                processingId === product._id
                                            }
                                            onClick={() =>
                                                handleAddToCart(product._id)
                                            }
                                        >

                                            <FaShoppingCart className="me-2" />

                                            Add to Cart

                                        </button>


                                        {/* Remove */}

                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            disabled={processingId === product._id}
                                            onClick={() =>
                                                handleRemove(product._id)
                                            }
                                        >

                                            <FaTrash className="me-2" />

                                            {processingId === product._id
                                                ? "Please wait..."
                                                : "Remove"
                                            }

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </section>

    );

}

export default Wishlist;
