import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBolt } from "react-icons/fa";

import { getAllProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import {
    getMyWishlist,
    addToWishlist,
    removeFromWishlist
} from "../services/wishlistService";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


// ================= PRODUCT LIST =================

function ProductList({ category = "", searchTerm = "" }) {

    const navigate = useNavigate();

    const { user } = useAuth();

    const { refreshCartCount } = useCart();

    const [products, setProducts] = useState([]);

    const [wishlistIds, setWishlistIds] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    const [addingProduct, setAddingProduct] = useState("");

    const [wishlistLoading, setWishlistLoading] = useState("");


    // ================= IMAGE URL =================

    const getImageUrl = (image) => {

        if (!image) {
            return "https://placehold.co/500x400?text=ShopEase+Product";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        if (image.startsWith("/")) {
            return `http://localhost:5000${image}`;
        }

        return `http://localhost:5000/${image}`;
    };


    // ================= LOAD PRODUCTS =================

    const fetchProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAllProducts(
                category,
                searchTerm.trim()
            );

            setProducts(data.products || []);

        } catch (err) {

            console.error("Product loading error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load products. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // ================= LOAD USER WISHLIST =================

    const fetchWishlist = async () => {

        if (!user) {
            setWishlistIds([]);
            return;
        }

        try {

            const data = await getMyWishlist();

            const wishlistProducts =
                data.wishlist?.products ||
                data.products ||
                data.wishlist?.items ||
                [];

            const ids = wishlistProducts.map((item) => {

                const product =
                    item.product ||
                    item.productId ||
                    item;

                return String(
                    product._id ||
                    product.id ||
                    item.productId
                );

            });

            setWishlistIds(ids);

        } catch (err) {

            console.error("Wishlist loading error:", err);

            setWishlistIds([]);

        }

    };


    // ================= USE EFFECT =================

    useEffect(() => {

        fetchProducts();

    }, [category, searchTerm]);


    useEffect(() => {

        fetchWishlist();

    }, [user]);


    // ================= ADD TO CART =================

    const handleAddToCart = async (product) => {

        if (!user) {

            alert("Please login first to add products to cart.");

            navigate("/login");

            return;

        }

        try {

            setAddingProduct(product._id);
            setMessage("");

            await addToCart(product._id, 1);

            await refreshCartCount();

            setMessage(`${product.name} added to cart successfully!`);

        } catch (err) {

            console.error("Add to cart error:", err);

            if (err.response?.status === 401) {

                alert("Please login first.");

                navigate("/login");

            } else {

                alert(
                    err.response?.data?.message ||
                    "Unable to add product to cart."
                );

            }

        } finally {

            setAddingProduct("");

        }

    };


    // ================= BUY NOW =================

    const handleBuyNow = (product) => {

        if (!user) {

            alert("Please login first to buy products.");

            navigate("/login");

            return;

        }

        navigate("/checkout", {

            state: {
                directBuy: true,
                product: product,
                quantity: 1
            }

        });

    };


    // ================= TOGGLE WISHLIST =================

    const handleWishlist = async (product) => {

        if (!user) {

            alert("Please login first to use wishlist.");

            navigate("/login");

            return;

        }

        try {

            setWishlistLoading(product._id);

            const productId = String(product._id);

            if (wishlistIds.includes(productId)) {

                await removeFromWishlist(product._id);

                setWishlistIds((previous) =>
                    previous.filter((id) => id !== productId)
                );

                setMessage(`${product.name} removed from wishlist.`);

            } else {

                await addToWishlist(product._id);

                setWishlistIds((previous) => [
                    ...previous,
                    productId
                ]);

                setMessage(`${product.name} added to wishlist!`);

            }

        } catch (err) {

            console.error("Wishlist error:", err);

            if (err.response?.status === 401) {

                alert("Please login first.");

                navigate("/login");

            } else {

                alert(
                    err.response?.data?.message ||
                    "Unable to update wishlist."
                );

            }

        } finally {

            setWishlistLoading("");

        }

    };


    // ================= LOADING =================

    if (loading) {

        return (

            <div className="text-center py-5">

                <div
                    className="spinner-border text-success"
                    role="status"
                ></div>

                <p className="mt-3">
                    Loading products...
                </p>

            </div>

        );

    }


    // ================= ERROR =================

    if (error) {

        return (

            <div className="alert alert-danger text-center">

                {error}

                <div className="mt-3">

                    <button
                        className="btn btn-success"
                        onClick={fetchProducts}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    // ================= PRODUCT LIST UI =================

    return (

        <div>

            {/* SUCCESS MESSAGE */}

            {message && (

                <div
                    className="alert alert-success text-center"
                    role="alert"
                >

                    {message}

                    <button
                        type="button"
                        className="btn-close ms-3"
                        aria-label="Close"
                        onClick={() => setMessage("")}
                    ></button>

                </div>

            )}


            {/* NO PRODUCTS */}

            {products.length === 0 ? (

                <div className="text-center py-5">

                    <h4>No Products Found</h4>

                    <p className="text-muted">
                        Try searching with another product name.
                    </p>

                </div>

            ) : (

                <div className="row g-4">

                    {products.map((product) => {

                        const isWishlisted = wishlistIds.includes(
                            String(product._id)
                        );

                        return (

                            <div
                                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                                key={product._id}
                            >

                                <div className="product-card h-100">

                                    {/* PRODUCT IMAGE */}

                                    <div className="product-image-wrapper">

                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className="product-image"
                                            onError={(e) => {

                                                e.target.onerror = null;

                                                e.target.src =
                                                    "https://placehold.co/500x400?text=ShopEase+Product";

                                            }}
                                        />


                                        {/* WISHLIST BUTTON */}

                                        <button
                                            type="button"
                                            className="wishlist-btn"
                                            title={
                                                isWishlisted
                                                    ? "Remove from Wishlist"
                                                    : "Add to Wishlist"
                                            }
                                            disabled={
                                                wishlistLoading === product._id
                                            }
                                            onClick={() =>
                                                handleWishlist(product)
                                            }
                                        >

                                            <svg
                                                width="23"
                                                height="23"
                                                viewBox="0 0 24 24"
                                                fill={
                                                    isWishlisted
                                                        ? "black"
                                                        : "none"
                                                }
                                                stroke="black"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >

                                                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z" />

                                            </svg>

                                        </button>

                                    </div>


                                    {/* PRODUCT DETAILS */}

                                    <div className="product-info">

                                        <span className="product-category">

                                            {product.category}

                                        </span>

                                        <h5 className="product-name">

                                            {product.name}

                                        </h5>

                                        <p className="product-description">

                                            {product.description}

                                        </p>


                                        {/* PRICE */}

                                        <div className="product-price">

                                            <strong>
                                                ₹{Number(product.price).toLocaleString("en-IN")}
                                            </strong>

                                            {product.originalPrice &&
                                                product.originalPrice > product.price && (

                                                    <del>
                                                        ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                                                    </del>

                                                )}

                                        </div>


                                        {/* STOCK */}

                                        <p className="small text-muted mb-3">

                                            {product.stock > 0
                                                ? `In Stock: ${product.stock}`
                                                : "Out of Stock"}

                                        </p>


                                        {/* ACTION BUTTONS */}

                                        <div className="d-flex gap-2">

                                            <button
                                                type="button"
                                                className="btn btn-success flex-fill"
                                                disabled={
                                                    product.stock <= 0 ||
                                                    addingProduct === product._id
                                                }
                                                onClick={() =>
                                                    handleAddToCart(product)
                                                }
                                            >

                                                <FaShoppingCart className="me-1" />

                                                {addingProduct === product._id
                                                    ? "Adding..."
                                                    : "Add to Cart"}

                                            </button>


                                            <button
                                                type="button"
                                                className="btn btn-dark flex-fill"
                                                disabled={product.stock <= 0}
                                                onClick={() =>
                                                    handleBuyNow(product)
                                                }
                                            >

                                                <FaBolt className="me-1" />

                                                Buy Now

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

}

export default ProductList;