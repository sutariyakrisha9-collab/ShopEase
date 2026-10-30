
import api from "./api";

export const getAllProducts = async (category = "", search = "") => {
    const params = {};

    if (category) {
        params.category = category;
    }

    if (search) {
        params.search = search;
    }

    const response = await api.get("/products", {
        params
    });

    return response.data;
};

export const getSingleProduct = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};
