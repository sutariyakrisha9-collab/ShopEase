import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getMyCart } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    const refreshCartCount = async () => {
        if (!user) {
            setCartCount(0);
            return;
        }

        try {
            const data = await getMyCart();

            const items = data.cart?.items || [];

            const totalQuantity = items.reduce((total, item) => {
                return total + Number(item.quantity || 0);
            }, 0);

            setCartCount(totalQuantity);
        } catch (error) {
            console.log("Cart count error:", error.message);
            setCartCount(0);
        }
    };

    useEffect(() => {
        refreshCartCount();
    }, [user]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);