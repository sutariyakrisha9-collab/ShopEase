
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { useAuth } from "./AuthContext";
import { getMyWishlist } from "../services/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

    const { user } = useAuth();

    const [wishlistCount, setWishlistCount] = useState(0);

    const refreshWishlistCount = async () => {

        if (!user) {

            setWishlistCount(0);

            return;

        }

        try {

            const data = await getMyWishlist();

            const products =
                data.wishlist?.products ||
                data.products ||
                data.wishlist?.items ||
                [];

            setWishlistCount(products.length);

        } catch (error) {

            console.log(
                "Wishlist count error:",
                error.message
            );

            setWishlistCount(0);

        }

    };


    useEffect(() => {

        refreshWishlistCount();

    }, [user]);


    return (

        <WishlistContext.Provider
            value={{
                wishlistCount,
                refreshWishlistCount
            }}
        >

            {children}

        </WishlistContext.Provider>

    );

};


export const useWishlist = () => useContext(WishlistContext);
