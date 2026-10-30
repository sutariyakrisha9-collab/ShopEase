
import api from "./api";

// Add product to wishlist
export const addToWishlist = async (productId) => {
    const response = await api.post("/wishlist/add", {
        productId
    });

    return response.data;
};

// Get logged-in user's wishlist
export const getMyWishlist = async () => {
    const response = await api.get("/wishlist");

    return response.data;
};

// Remove one product from wishlist
export const removeFromWishlist = async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);

    return response.data;
};

// Clear complete wishlist
export const clearWishlist = async () => {
    const response = await api.delete("/wishlist/clear");

    return response.data;
};
