import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    registerUser,
    loginUser,
    logoutUser,
    getMyProfile
} from "../services/authService";

// Create Auth Context
const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check login when application starts
    const checkAuth = async () => {
        try {
            const data = await getMyProfile();
            setUser(data.user);

        } catch (error) {
            setUser(null);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Register function
    const register = async (userData) => {
        const data = await registerUser(userData);

        setUser(data.user);

        return data;
    };

    // Login function
    const login = async (userData) => {
        const data = await loginUser(userData);

        setUser(data.user);

        return data;
    };

    // Logout function
    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    };

    // Refresh user profile
    const refreshUser = async () => {
        try {
            const data = await getMyProfile();
            setUser(data.user);
            return data.user;

        } catch (error) {
            setUser(null);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = () => {
    return useContext(AuthContext);
};
