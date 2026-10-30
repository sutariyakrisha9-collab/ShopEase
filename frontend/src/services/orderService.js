import api from "./api";

// Place order using logged-in user's cart
export const createOrder = async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
};

// Get logged-in user's orders
export const getMyOrders = async () => {
    const response = await api.get("/orders/my-orders");
    return response.data;
};

// Get one order by ID
export const getOrderById = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};

// Cancel an order
export const cancelOrder = async (orderId) => {
    const response = await api.patch(`/orders/${orderId}/cancel`);
    return response.data;
};
