import "./App.css";

import { useState } from "react";

import ProductList from "./components/ProductList";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";

import {
    Routes,
    Route,
    Link,
    Navigate,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    FaShoppingBag,
    FaSearch,
    FaUser,
    FaHeart,
    FaShoppingCart,
    FaArrowRight,
    FaTruck,
    FaShieldAlt,
    FaHeadset,
    FaSignOutAlt,
    FaClipboardList
} from "react-icons/fa";


// ================= CATEGORY DATA =================

const categories = [
    {
        id: 1,
        name: "Fashion",
        slug: "fashion",
        emoji: "👕"
    },
    {
        id: 2,
        name: "Electronics",
        slug: "electronics",
        emoji: "💻"
    },
    {
        id: 3,
        name: "Accessories",
        slug: "accessories",
        emoji: "⌚"
    },
    {
        id: 4,
        name: "Home & Living",
        slug: "home-living",
        emoji: "🏠"
    }
];


// ================= CATEGORY PAGE =================

function CategoryPage() {

    const { category } = useParams();

    const selectedCategory = categories.find(
        (item) => item.slug === category
    );

    if (!selectedCategory) {
        return <Navigate to="/" replace />;
    }

    return (

        <section className="product-section category-products-page">

            <div className="container">

                <div className="section-heading">

                    <span>SHOP BY CATEGORY</span>

                    <h2>
                        {selectedCategory.emoji} {selectedCategory.name}
                    </h2>

                    <p>
                        Explore products in {selectedCategory.name}.
                    </p>

                </div>

                <ProductList category={selectedCategory.name} />

            </div>

        </section>

    );

}


// ================= SEARCH PAGE =================

function SearchPage() {

    const [searchInput, setSearchInput] = useState("");

    const [submittedSearch, setSubmittedSearch] = useState("");


    const handleSearch = (e) => {

        e.preventDefault();

        setSubmittedSearch(searchInput.trim());

    };


    return (

        <section className="product-section">

            <div className="container">

                <div className="section-heading">

                    <span>FIND YOUR PRODUCT</span>

                    <h2>Search Products</h2>

                    <p>
                        Find your favourite products at ShopEase.
                    </p>

                </div>


                {/* SEARCH FORM */}

                <form
                    onSubmit={handleSearch}
                    className="d-flex gap-2 mx-auto mb-5"
                    style={{ maxWidth: "600px" }}
                >

                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search products... e.g. shirt, watch, laptop"
                        value={searchInput}
                        onChange={(e) =>
                            setSearchInput(e.target.value)
                        }
                    />

                    <button
                        type="submit"
                        className="btn btn-success"
                    >

                        <FaSearch className="me-2" />

                        Search

                    </button>

                </form>


                {/* SEARCH RESULT HEADING */}

                {submittedSearch && (

                    <h5 className="mb-4">

                        Search results for: "{submittedSearch}"

                    </h5>

                )}


                {/* PRODUCTS */}

                <ProductList searchTerm={submittedSearch} />

            </div>

        </section>

    );

}


// ================= HOME PAGE =================

function HomePage() {

    return (

        <>

            {/* HERO SECTION */}

            <section className="hero-section">

                <div className="container">

                    <div className="row align-items-center">

                        <div className="col-lg-6">

                            <span className="hero-label">
                                ✨ YOUR EVERYDAY SHOPPING DESTINATION
                            </span>

                            <h1>
                                Discover Your
                                <span> Style & More.</span>
                            </h1>

                            <p>
                                Explore amazing products, discover new
                                trends and enjoy a seamless shopping
                                experience with ShopEase.
                            </p>

                            <div className="hero-buttons">

                                <a
                                    href="#products"
                                    className="shop-btn"
                                >
                                    Shop Now <FaArrowRight />
                                </a>

                                <a
                                    href="#categories"
                                    className="explore-btn"
                                >
                                    Explore Categories
                                </a>

                            </div>

                            <div className="hero-stats">

                                <div>
                                    <h3>500+</h3>
                                    <p>Products</p>
                                </div>

                                <div>
                                    <h3>1000+</h3>
                                    <p>Happy Customers</p>
                                </div>

                                <div>
                                    <h3>24/7</h3>
                                    <p>Support</p>
                                </div>

                            </div>

                        </div>


                        <div className="col-lg-6">

                            <div className="hero-image">

                                <div className="hero-circle">

                                    <div className="hero-emoji">
                                        🛍️
                                    </div>

                                </div>

                                <div className="floating-card">

                                    <span>🎉</span>

                                    <div>
                                        <strong>Special Offers</strong>
                                        <p>Great deals every day!</p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* CATEGORY SECTION */}

            <section
                className="category-section"
                id="categories"
            >

                <div className="container">

                    <div className="section-heading">

                        <span>EXPLORE</span>

                        <h2>Shop by Category</h2>

                        <p>
                            Find everything you need in one place.
                        </p>

                    </div>

                    <div className="row g-4">

                        {categories.map((category) => (

                            <div
                                className="col-6 col-md-3"
                                key={category.id}
                            >

                                <Link
                                    to={`/category/${category.slug}`}
                                    className="category-card"
                                >

                                    <div>{category.emoji}</div>

                                    <h5>{category.name}</h5>

                                </Link>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* PRODUCT SECTION */}

            <section
                className="product-section"
                id="products"
            >

                <div className="container">

                    <div className="section-heading">

                        <span>OUR COLLECTION</span>

                        <h2>Featured Products</h2>

                        <p>
                            Discover our popular products.
                        </p>

                    </div>

                    <ProductList />

                </div>

            </section>


            {/* FEATURES SECTION */}

            <section
                className="features-section"
                id="about"
            >

                <div className="container">

                    <div className="row g-4">

                        <div className="col-md-4">

                            <div className="feature-card">

                                <FaTruck />

                                <h5>Fast Delivery</h5>

                                <p>
                                    Get your products delivered to your
                                    doorstep.
                                </p>

                            </div>

                        </div>


                        <div className="col-md-4">

                            <div className="feature-card">

                                <FaShieldAlt />

                                <h5>Secure Shopping</h5>

                                <p>
                                    Shop confidently with secure accounts.
                                </p>

                            </div>

                        </div>


                        <div className="col-md-4">

                            <div className="feature-card">

                                <FaHeadset />

                                <h5>Customer Support</h5>

                                <p>
                                    We are here to help you whenever
                                    you need.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* FOOTER */}

            <footer className="shop-footer">

                <div className="container text-center">

                    <h3>ShopEase.</h3>

                    <p>
                        Your style. Your choice. Your ShopEase.
                    </p>

                    <small>
                        © 2026 ShopEase. All Rights Reserved.
                    </small>

                </div>

            </footer>

        </>

    );

}


// ================= NAVBAR =================

function Navbar() {

    const { user, loading, logout } = useAuth();

    const { cartCount } = useCart();

    const { wishlistCount } = useWishlist();

    const navigate = useNavigate();


    // ================= LOGOUT HANDLER =================

    const handleLogout = async () => {

        try {

            await logout();

            navigate("/");

        } catch (error) {

            console.error("Logout error:", error);

            alert("Unable to logout. Please try again.");

        }

    };


    return (

        <nav className="navbar navbar-expand-lg shop-navbar">

            <div className="container">


                {/* LOGO */}

                <Link className="navbar-brand logo" to="/">

                    <FaShoppingBag />

                    ShopEase<span>.</span>

                </Link>


                {/* MOBILE MENU BUTTON */}

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >

                    <span className="navbar-toggler-icon"></span>

                </button>


                {/* NAVIGATION LINKS */}

                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >

                    <ul className="navbar-nav mx-auto">


                        {/* HOME */}

                        <li className="nav-item">

                            <Link className="nav-link" to="/">
                                Home
                            </Link>

                        </li>


                        {/* PRODUCTS */}

                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/#products"
                            >
                                Products
                            </Link>

                        </li>


                        {/* CATEGORY DROPDOWN */}

                        <li className="nav-item dropdown">

                            <a
                                className="nav-link dropdown-toggle"
                                href="#categories"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Categories
                            </a>

                            <ul className="dropdown-menu">

                                {categories.map((category) => (

                                    <li key={category.id}>

                                        <Link
                                            className="dropdown-item"
                                            to={`/category/${category.slug}`}
                                        >

                                            {category.emoji} {category.name}

                                        </Link>

                                    </li>

                                ))}

                            </ul>

                        </li>


                        {/* ABOUT */}

                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/#about"
                            >
                                About
                            </Link>

                        </li>


                        {/* MY ORDERS */}

                        {user && (

                            <li className="nav-item">

                                <Link
                                    className="nav-link"
                                    to="/my-orders"
                                >

                                    <FaClipboardList className="me-1" />

                                    My Orders

                                </Link>

                            </li>

                        )}


                        {/* MY PROFILE */}

                        {user && (

                            <li className="nav-item">

                                <Link
                                    className="nav-link"
                                    to="/profile"
                                >

                                    <FaUser className="me-1" />

                                    My Profile

                                </Link>

                            </li>

                        )}

                    </ul>


                    {/* NAVBAR ICONS */}

                    <div className="nav-icons">


                        {/* SEARCH ICON */}

                        <button
                            className="icon-btn"
                            type="button"
                            title="Search"
                            onClick={() => navigate("/search")}
                        >

                            <FaSearch />

                        </button>


                        {/* WISHLIST ICON */}

                        <button
                            className="icon-btn"
                            type="button"
                            title="Wishlist"
                            aria-label={`Wishlist, ${wishlistCount} items`}
                            onClick={() => navigate("/wishlist")}
                        >

                            <FaHeart />

                            {user && wishlistCount > 0 && (

                                <span className="badge bg-danger ms-1">
                                    {wishlistCount}
                                </span>

                            )}

                        </button>


                        {/* ACCOUNT / LOGIN */}

                        {!loading && (

                            user ? (

                                <div className="account-actions">

                                    <span className="account-btn">

                                        <FaUser />

                                        <span>
                                            Hi, {user.name}
                                        </span>

                                    </span>


                                    <button
                                        className="logout-btn"
                                        type="button"
                                        onClick={handleLogout}
                                    >

                                        <FaSignOutAlt />

                                        <span>Logout</span>

                                    </button>

                                </div>

                            ) : (

                                <Link
                                    to="/login"
                                    className="account-btn"
                                    title="Login"
                                >

                                    <FaUser />

                                    <span>Login</span>

                                </Link>

                            )

                        )}


                        {/* CART ICON WITH COUNT */}

                        <button
                            className="cart-btn"
                            type="button"
                            title="Shopping Cart"
                            aria-label={`Shopping cart, ${cartCount} items`}
                            onClick={() => navigate("/cart")}
                        >

                            <FaShoppingCart />

                            {cartCount > 0 && (

                                <span className="cart-count">
                                    {cartCount}
                                </span>

                            )}

                        </button>

                    </div>

                </div>

            </div>

        </nav>

    );

}


// ================= MAIN APP =================

function App() {

    const { user, loading } = useAuth();

    return (

        <div className="shopease">

            <Navbar />

            <Routes>


                {/* HOME PAGE */}

                <Route
                    path="/"
                    element={<HomePage />}
                />


                {/* CATEGORY PAGE */}

                <Route
                    path="/category/:category"
                    element={<CategoryPage />}
                />


                {/* SEARCH PAGE */}

                <Route
                    path="/search"
                    element={<SearchPage />}
                />


                {/* LOGIN PAGE */}

                <Route
                    path="/login"
                    element={
                        loading
                            ? (
                                <p className="text-center py-5">
                                    Loading...
                                </p>
                            )
                            : user
                                ? <Navigate to="/" replace />
                                : <Login />
                    }
                />


                {/* REGISTER PAGE */}

                <Route
                    path="/register"
                    element={
                        loading
                            ? (
                                <p className="text-center py-5">
                                    Loading...
                                </p>
                            )
                            : user
                                ? <Navigate to="/" replace />
                                : <Register />
                    }
                />


                {/* SHOPPING CART PAGE */}

                <Route
                    path="/cart"
                    element={<Cart />}
                />


                {/* CHECKOUT PAGE */}

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />


                {/* MY ORDERS PAGE */}

                <Route
                    path="/my-orders"
                    element={
                        loading
                            ? (
                                <p className="text-center py-5">
                                    Loading...
                                </p>
                            )
                            : user
                                ? <MyOrders />
                                : <Navigate to="/login" replace />
                    }
                />


                {/* WISHLIST PAGE */}

                <Route
                    path="/wishlist"
                    element={<Wishlist />}
                />


                {/* MY PROFILE PAGE */}

                <Route
                    path="/profile"
                    element={
                        loading
                            ? (
                                <p className="text-center py-5">
                                    Loading...
                                </p>
                            )
                            : user
                                ? <Profile />
                                : <Navigate to="/login" replace />
                    }
                />


                {/* INVALID URL */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </div>

    );

}

export default App;