require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

// ================= ALL PRODUCTS =================

const products = [

    // ================= FASHION =================

    {
        name: "Women's Floral Dress",
        description: "Beautiful floral dress for casual and party wear.",
        price: 1499, originalPrice: 1899, category: "Fashion", stock: 20,
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
    },
    {
        name: "Men's Casual Shirt",
        description: "Comfortable stylish shirt for everyday use.",
        price: 999, originalPrice: 1299, category: "Fashion", stock: 25,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"
    },
    {
        name: "Running Sneakers",
        description: "Lightweight sneakers for daily walking and running.",
        price: 1799, originalPrice: 2199, category: "Fashion", stock: 15,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
    },
    {
        name: "Women's Summer Top",
        description: "Trendy summer top for a comfortable look.",
        price: 799, originalPrice: 999, category: "Fashion", stock: 20,
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800"
    },
    {
        name: "Men's Denim Jacket",
        description: "Stylish denim jacket for a modern look.",
        price: 1999, originalPrice: 2499, category: "Fashion", stock: 12,
        image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800"
    },
    {
        name: "Women's Kurti",
        description: "Elegant traditional kurti for daily and festive wear.",
        price: 1299, originalPrice: 1699, category: "Fashion", stock: 20,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800"
    },
    {
        name: "Men's Formal Trousers",
        description: "Comfortable formal trousers for office wear.",
        price: 1199, originalPrice: 1499, category: "Fashion", stock: 18,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800"
    },
    {
        name: "Women's Party Gown",
        description: "Beautiful party gown for special occasions.",
        price: 2499, originalPrice: 2999, category: "Fashion", stock: 10,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"
    },
    {
        name: "Men's Polo T-Shirt",
        description: "Classic polo t-shirt for everyday comfort.",
        price: 699, originalPrice: 899, category: "Fashion", stock: 25,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
    },
    {
        name: "Women's Jeans",
        description: "Trendy wide-leg jeans with a comfortable fit.",
        price: 1399, originalPrice: 1799, category: "Fashion", stock: 15,
        image: "https://onesodenim.com/cdn/shop/articles/oneso84.png?v=1781675315"
    },
    {
        name: "Men's Hoodie",
        description: "Warm and stylish hoodie for casual wear.",
        price: 1499, originalPrice: 1899, category: "Fashion", stock: 20,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"
    },
    {
        name: "Women's Casual Top",
        description: "Simple and fashionable top for daily use.",
        price: 599, originalPrice: 799, category: "Fashion", stock: 25,
        image: "https://images.unsplash.com/photo-1564257577-2d9b3a8b7a4c?w=800"
    },
    {
        name: "Men's Sports Shoes",
        description: "Comfortable sports shoes for active lifestyles.",
        price: 1899, originalPrice: 2399, category: "Fashion", stock: 15,
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800"
    },
    {
        name: "Women's Long Dress",
        description: "Elegant long dress for casual outings.",
        price: 1599, originalPrice: 1999, category: "Fashion", stock: 12,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800"
    },
    {
        name: "Men's Cotton Kurta",
        description: "Traditional cotton kurta for festive occasions.",
        price: 1099, originalPrice: 1399, category: "Fashion", stock: 18,
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800"
    },
    {
        name: "Women's Palazzo Set",
        description: "Stylish palazzo set for everyday comfort.",
        price: 1199, originalPrice: 1499, category: "Fashion", stock: 20,
        image: "https://images.unsplash.com/photo-1583391733956-6c78276477e?w=800"
    },
    {
        name: "Men's Casual Jacket",
        description: "Modern casual jacket for outdoor wear.",
        price: 2199, originalPrice: 2699, category: "Fashion", stock: 10,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
    },
    {
        name: "Women's Printed Saree",
        description: "Beautiful printed saree for traditional occasions.",
        price: 1799, originalPrice: 2299, category: "Fashion", stock: 15,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800"
    },
    {
        name: "Men's Slim Fit Jeans",
        description: "Modern slim fit jeans for casual outfits.",
        price: 1299, originalPrice: 1699, category: "Fashion", stock: 20,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
    },
    {
        name: "Women's Ethnic Wear",
        description: "Traditional ethnic outfit for special occasions.",
        price: 1999, originalPrice: 2499, category: "Fashion", stock: 12,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800"
    },

    // ================= ELECTRONICS =================

    {
        name: "Bluetooth Speaker",
        description: "Portable wireless speaker with powerful sound.",
        price: 1299, originalPrice: 1599, category: "Electronics", stock: 20,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800"
    },
    {
        name: "Digital Camera",
        description: "Compact digital camera for capturing memories.",
        price: 8999, originalPrice: 9999, category: "Electronics", stock: 10,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"
    },
    {
        name: "Wireless Earbuds",
        description: "Wireless earbuds with clear sound and comfortable fit.",
        price: 1599, originalPrice: 1999, category: "Electronics", stock: 30,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800"
    },
    {
        name: "Smart Watch",
        description: "Modern smartwatch for everyday activities.",
        price: 2499, originalPrice: 2999, category: "Electronics", stock: 15,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
    },
    {
        name: "Laptop",
        description: "Powerful laptop for work and entertainment.",
        price: 45999, originalPrice: 49999, category: "Electronics", stock: 8,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
    },
    {
        name: "Wireless Headphones",
        description: "Premium headphones with excellent sound quality.",
        price: 1999, originalPrice: 2499, category: "Electronics", stock: 20,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
    },
    {
        name: "Gaming Mouse",
        description: "Ergonomic gaming mouse for smooth control.",
        price: 899, originalPrice: 1199, category: "Electronics", stock: 25,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800"
    },
    {
        name: "Mechanical Keyboard",
        description: "Comfortable mechanical keyboard for gaming and work.",
        price: 2499, originalPrice: 2999, category: "Electronics", stock: 12,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800"
    },
    {
        name: "LED Monitor",
        description: "Full HD monitor for office and entertainment.",
        price: 8999, originalPrice: 10999, category: "Electronics", stock: 10,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"
    },
    {
        name: "Power Bank",
        description: "Portable power bank for charging devices.",
        price: 999, originalPrice: 1299, category: "Electronics", stock: 30,
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800"
    },
    {
        name: "Mobile Phone",
        description: "Modern smartphone with excellent performance.",
        price: 15999, originalPrice: 18999, category: "Electronics", stock: 12,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"
    },
    {
        name: "Tablet",
        description: "Lightweight tablet for study and entertainment.",
        price: 12999, originalPrice: 14999, category: "Electronics", stock: 10,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800"
    },
    {
        name: "USB Flash Drive",
        description: "Portable USB drive for storing your files.",
        price: 499, originalPrice: 699, category: "Electronics", stock: 40,
        image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800"
    },
    {
        name: "Wireless Mouse",
        description: "Smooth wireless mouse for everyday use.",
        price: 599, originalPrice: 799, category: "Electronics", stock: 25,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800"
    },
    {
        name: "DSLR Camera Lens",
        description: "Camera lens for high-quality photography.",
        price: 6999, originalPrice: 7999, category: "Electronics", stock: 8,
        image: "https://images.unsplash.com/photo-1510127034890-7bd08a7c7c75?w=800"
    },
    {
        name: "Smart LED Bulb",
        description: "Energy-efficient smart LED bulb for your home.",
        price: 399, originalPrice: 599, category: "Electronics", stock: 30,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800"
    },
    {
        name: "Portable Projector",
        description: "Compact projector for home entertainment.",
        price: 7999, originalPrice: 9999, category: "Electronics", stock: 7,
        image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800"
    },
    {
        name: "Bluetooth Keyboard",
        description: "Wireless keyboard for convenient typing.",
        price: 1299, originalPrice: 1599, category: "Electronics", stock: 18,
        image: "https://multimedia.bbycastatic.ca/multimedia/products/500x500/189/18925/18925906.jpeg"
    },
    {
        name: "Webcam",
        description: "HD webcam for online meetings and video calls.",
        price: 1499, originalPrice: 1899, category: "Electronics", stock: 15,
        image: "https://www.groupgear.co.uk/images/24-1019.jpg"
    },
    {
        name: "Mobile Charger",
        description: "Fast charging adapter for compatible devices.",
        price: 699, originalPrice: 899, category: "Electronics", stock: 35,
        image: "https://www.mobilmax.cz/files/upload/1007/obrazky/1026011-nabijecka-apple-iphoneipad-a2347-usb-c-20w-pd-rychlonabijecka-original-01.JPG"
    },

    // ================= ACCESSORIES =================

    {
        name: "Ladies Handbag",
        description: "Elegant handbag suitable for everyday use.",
        price: 1599, originalPrice: 1999, category: "Accessories", stock: 15,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"
    },
    {
        name: "Classic Wrist Watch",
        description: "Elegant wrist watch with a classic design.",
        price: 1299, originalPrice: 1699, category: "Accessories", stock: 18,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800"
    },
    {
        name: "Premium Belt",
        description: "Stylish and durable belt for everyday outfits.",
        price: 499, originalPrice: 699, category: "Accessories", stock: 25,
        image: "https://images.unsplash.com/photo-1624222247344-550fb8c7c9f7?w=800"
    },
    {
        name: "Stylish Sunglasses",
        description: "Trendy sunglasses for a stylish look.",
        price: 699, originalPrice: 999, category: "Accessories", stock: 35,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800"
    },
    {
        name: "Leather Wallet",
        description: "Premium wallet with multiple card slots.",
        price: 499, originalPrice: 699, category: "Accessories", stock: 30,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800"
    },
    {
        name: "Travel Backpack",
        description: "Spacious backpack for travel and daily use.",
        price: 1499, originalPrice: 1899, category: "Accessories", stock: 20,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"
    },
    {
        name: "Women's Clutch Bag",
        description: "Elegant clutch bag for parties and events.",
        price: 899, originalPrice: 1199, category: "Accessories", stock: 15,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800"
    },
    {
        name: "Men's Leather Wallet",
        description: "Classic black leather wallet with a compact design.",
        price: 799, originalPrice: 999, category: "Accessories", stock: 20,
        image: "https://images.meesho.com/images/products/679997619/tg69t_512.jpg"
    },
    {
        name: "Fashion Bracelet",
        description: "Stylish bracelet for everyday fashion.",
        price: 399, originalPrice: 599, category: "Accessories", stock: 30,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"
    },
    {
        name: "Silver Necklace",
        description: "Beautiful necklace for special occasions.",
        price: 999, originalPrice: 1299, category: "Accessories", stock: 18,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
    },
    {
        name: "Casual Cap",
        description: "Comfortable cap for outdoor activities.",
        price: 399, originalPrice: 599, category: "Accessories", stock: 25,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800"
    },
    {
        name: "Leather Watch",
        description: "Premium watch with a leather strap.",
        price: 1799, originalPrice: 2199, category: "Accessories", stock: 12,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800"
    },
    {
        name: "Travel Duffle Bag",
        description: "Spacious duffle bag for weekend travel.",
        price: 1299, originalPrice: 1599, category: "Accessories", stock: 15,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format"
    },
    {
        name: "Fashion Earrings",
        description: "Beautiful earrings for casual and party wear.",
        price: 499, originalPrice: 699, category: "Accessories", stock: 25,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"
    },
    {
        name: "Keychain Set",
        description: "Decorative keychain set for everyday use.",
        price: 199, originalPrice: 299, category: "Accessories", stock: 40,
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800"
    },
    {
        name: "Card Holder",
        description: "Compact card holder for carrying essentials.",
        price: 349, originalPrice: 499, category: "Accessories", stock: 30,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format"
    },
    {
        name: "Sports Sunglasses",
        description: "Lightweight sunglasses for outdoor activities.",
        price: 899, originalPrice: 1199, category: "Accessories", stock: 20,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800"
    },
    {
        name: "Women's Tote Bag",
        description: "Trendy tote bag for shopping and daily use.",
        price: 1099, originalPrice: 1399, category: "Accessories", stock: 18,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"
    },
    {
        name: "Fashion Ring",
        description: "Elegant ring for a stylish appearance.",
        price: 599, originalPrice: 799, category: "Accessories", stock: 25,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800"
    },
    {
        name: "Travel Pouch",
        description: "Useful pouch for organizing travel essentials.",
        price: 449, originalPrice: 599, category: "Accessories", stock: 25,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"
    },

    // ================= HOME & LIVING =================

    {
        name: "Indoor Green Plant",
        description: "Beautiful indoor plant to decorate your home.",
        price: 499, originalPrice: 699, category: "Home & Living", stock: 25,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800"
    },
    {
        name: "Modern Accent Chair",
        description: "Comfortable modern chair for your living room.",
        price: 4999, originalPrice: 5999, category: "Home & Living", stock: 8,
        image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800"
    },
    {
        name: "Decorative Cushion",
        description: "Soft decorative cushion for sofa and bedroom.",
        price: 399, originalPrice: 599, category: "Home & Living", stock: 30,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800"
    },
    {
        name: "Modern Table Lamp",
        description: "Elegant table lamp for your bedroom and living room.",
        price: 1299, originalPrice: 1599, category: "Home & Living", stock: 18,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800"
    },
    {
        name: "Decorative Flower Vase",
        description: "Beautiful decorative vase for your home.",
        price: 799, originalPrice: 999, category: "Home & Living", stock: 22,
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800"
    },
    {
        name: "Wall Clock",
        description: "Modern wall clock for home decoration.",
        price: 899, originalPrice: 1199, category: "Home & Living", stock: 15,
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800"
    },
    {
        name: "Table Organizer",
        description: "Useful organizer for your desk and workspace.",
        price: 499, originalPrice: 699, category: "Home & Living", stock: 25,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
    },
    {
        name: "Soft Bed Sheet",
        description: "Comfortable bedsheet for a relaxing sleep.",
        price: 999, originalPrice: 1299, category: "Home & Living", stock: 20,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"
    },
    {
        name: "Ceramic Coffee Mug",
        description: "Stylish ceramic mug for coffee and tea.",
        price: 299, originalPrice: 399, category: "Home & Living", stock: 35,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800"
    },
    {
        name: "Decorative Wall Art",
        description: "Beautiful wall art for modern interiors.",
        price: 1499, originalPrice: 1899, category: "Home & Living", stock: 10,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800"
    },
    {
        name: "Storage Basket",
        description: "Multipurpose basket for home organization.",
        price: 599, originalPrice: 799, category: "Home & Living", stock: 25,
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"
    },
    {
        name: "Kitchen Container Set",
        description: "Useful containers for organized kitchen storage.",
        price: 699, originalPrice: 899, category: "Home & Living", stock: 20,
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800"
    },
    {
        name: "Floor Lamp",
        description: "Modern floor lamp for your living room.",
        price: 2499, originalPrice: 2999, category: "Home & Living", stock: 8,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format"
    },
    {
        name: "Dining Table Decor",
        description: "Elegant decoration item for dining tables.",
        price: 799, originalPrice: 999, category: "Home & Living", stock: 15,
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800"
    },
    {
        name: "Bathroom Organizer",
        description: "Compact organizer for bathroom essentials.",
        price: 449, originalPrice: 599, category: "Home & Living", stock: 25,
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800"
    },
    {
        name: "Decorative Mirror",
        description: "Stylish mirror for bedroom and living room.",
        price: 1799, originalPrice: 2199, category: "Home & Living", stock: 10,
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800"
    },
    {
        name: "Cotton Blanket",
        description: "Soft cotton blanket for everyday comfort.",
        price: 1199, originalPrice: 1499, category: "Home & Living", stock: 18,
        image: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=800"
    },
    {
        name: "Wooden Photo Frame",
        description: "Beautiful photo frame for your memories.",
        price: 399, originalPrice: 599, category: "Home & Living", stock: 30,
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800"
    },
    {
        name: "Ceramic Planter",
        description: "Modern planter for indoor plants.",
        price: 549, originalPrice: 749, category: "Home & Living", stock: 20,
        image: "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=800"
    },
    {
        name: "Laundry Basket",
        description: "Spacious laundry basket for home use.",
        price: 699, originalPrice: 899, category: "Home & Living", stock: 15,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800"
    }

];


// ================= SEED FUNCTION =================

const seedProducts = async () => {

    try {

        await connectDB();

        console.log("\nMongoDB connected successfully!");

        console.log("\nUpdating and adding products...");

        // Update existing products or insert missing products.
        // Existing product IDs remain unchanged.

        for (const product of products) {

            await Product.updateOne(
                {
                    name: product.name,
                    category: product.category
                },
                {
                    $set: {
                        ...product,
                        brand: "ShopEase",
                        isActive: true,
                        featured: false
                    }
                },
                {
                    upsert: true,
                    runValidators: true
                }
            );

        }

        // Set first five products in each category as featured.

        const categories = [
            "Fashion",
            "Electronics",
            "Accessories",
            "Home & Living"
        ];

        for (const category of categories) {

            const categoryProducts = products.filter(
                product => product.category === category
            );

            for (let i = 0; i < categoryProducts.length; i++) {

                await Product.updateOne(
                    {
                        name: categoryProducts[i].name,
                        category: category
                    },
                    {
                        $set: {
                            featured: i < 5
                        }
                    }
                );

            }

        }

        // Final category count.

        console.log("\n========== PRODUCT SUMMARY ==========");

        for (const category of categories) {

            const count = await Product.countDocuments({
                category: category,
                isActive: true
            });

            console.log(`${category}: ${count} products`);

        }

        console.log("\nAll products updated successfully!");

    } catch (error) {

        console.error("\nSeed error:", error);

        process.exitCode = 1;

    } finally {

        await mongoose.disconnect();

        console.log("\nMongoDB connection closed.");

    }

};

seedProducts();