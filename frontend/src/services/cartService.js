import api from "./api";

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
    const response = await api.post("/cart/add", {
        productId,
        quantity
    });

    return response.data;
};

// Get logged-in user's cart
export const getMyCart = async () => {
    const response = await api.get("/cart");
    return response.data;
};

// Update product quantity
export const updateCartQuantity = async (productId, quantity) => {
    const response = await api.patch(`/cart/${productId}`, {
        quantity
    });

    return response.data;
};

// Remove one product
export const removeFromCart = async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
};

// Clear complete cart
export const clearMyCart = async () => {
    const response = await api.delete("/cart/clear");
    return response.data;
};
