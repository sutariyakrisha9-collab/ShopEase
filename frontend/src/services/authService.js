
import api from "./api";

// ================= REGISTER NEW USER =================

export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};


// ================= LOGIN EXISTING USER =================

export const loginUser = async (userData) => {
    const response = await api.post("/auth/login", userData);
    return response.data;
};


// ================= LOGOUT USER =================

export const logoutUser = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
};


// ================= GET LOGGED-IN USER PROFILE =================

export const getMyProfile = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};


// ================= UPDATE USER PROFILE =================

export const updateMyProfile = async (profileData) => {
    const response = await api.put(
        "/auth/update-profile",
        profileData
    );

    return response.data;
};
