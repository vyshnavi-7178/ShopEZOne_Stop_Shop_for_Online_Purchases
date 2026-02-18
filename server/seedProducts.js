// 🌱 Seed database with sample products

import mongoose from 'mongoose';
import { Admin, Product } from './Schema.js';

const MONGO_URI = 'mongodb://localhost:27017/shopEZ';

const sampleProducts = [
    // 👟 Shoes
    {
        title: "Nike Air Max 270",
        description: "Men's running shoes with comfortable air cushioning and breathable mesh upper. Perfect for daily wear and exercise.",
        mainImg: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?w=400",
        carousel: [
            "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?w=400",
            "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?w=400",
            "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?w=400"
        ],
        category: "shoes",
        brand: "Nike",
        price: 149.99,
        discount: 15,
        rating: 4.7,
        countInStock: 45,
        gender: "men",
        sizes: ["7", "8", "9", "10", "11", "12", "13"]
    },
    {
        title: "Adidas Ultraboost 22",
        description: "Women's running shoes with responsive boost cushioning and primeknit upper. Maximum comfort for long runs.",
        mainImg: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?w=400",
        carousel: [
            "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?w=400",
            "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?w=400"
        ],
        category: "shoes",
        brand: "Adidas",
        price: 179.99,
        discount: 20,
        rating: 4.8,
        countInStock: 35,
        gender: "women",
        sizes: ["5", "6", "7", "8", "9", "10", "11"]
    },
    {
        title: "Puma RS-X",
        description: "Unisex sneakers with chunky silhouette and cushioning sole. Stylish and comfortable for everyday wear.",
        mainImg: "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?w=400",
        carousel: [
            "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?w=400",
            "https://images.pexels.com/photos/1478444/pexels-photo-1478444.jpeg?w=400"
        ],
        category: "shoes",
        brand: "Puma",
        price: 119.99,
        discount: 10,
        rating: 4.6,
        countInStock: 50,
        gender: "unisex",
        sizes: ["6", "7", "8", "9", "10", "11", "12"]
    },
    {
        title: "Converse Chuck Taylor",
        description: "Classic canvas high-top sneakers. Timeless style that goes with everything.",
        mainImg: "https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?w=400",
        carousel: [
            "https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?w=400",
            "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?w=400"
        ],
        category: "shoes",
        brand: "Converse",
        price: 69.99,
        discount: 5,
        rating: 4.8,
        countInStock: 80,
        gender: "unisex",
        sizes: ["5", "6", "7", "8", "9", "10", "11", "12"]
    },
    {
        title: "Vans Old Skool",
        description: "Classic skate shoes with durable suede and canvas upper. Signature side stripe.",
        mainImg: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?w=400",
        carousel: [
            "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?w=400",
            "https://images.pexels.com/photos/1124467/pexels-photo-1124467.jpeg?w=400"
        ],
        category: "shoes",
        brand: "Vans",
        price: 74.99,
        discount: 0,
        rating: 4.7,
        countInStock: 65,
        gender: "unisex",
        sizes: ["6", "7", "8", "9", "10", "11", "12"]
    },
    {
        title: "Timberland Boots",
        description: "Men's waterproof leather boots. Durable, comfortable, and perfect for outdoor adventures.",
        mainImg: "https://images.pexels.com/photos/2894646/pexels-photo-2894646.jpeg?w=400",
        carousel: [
            "https://images.pexels.com/photos/2894646/pexels-photo-2894646.jpeg?w=400",
            "https://images.pexels.com/photos/2894647/pexels-photo-2894647.jpeg?w=400"
        ],
        category: "shoes",
        brand: "Timberland",
        price: 199.99,
        discount: 25,
        rating: 4.9,
        countInStock: 30,
        gender: "men",
        sizes: ["8", "9", "10", "11", "12", "13"]
    },

    // 📱 Mobiles
    {
        title: "iPhone 14 Pro",
        description: "Apple iPhone 14 Pro with A16 Bionic chip, 48MP camera, and Dynamic Island. 6.1-inch Super Retina XDR display.",
        mainImg: "https://images.pexels.com/photos/13345923/pexels-photo-13345923.jpeg?w=400",
        carousel: [
            "https://images.pexels.com/photos/13345923/pexels-photo-13345923.jpeg?w=400",
            "https://images.pexels.com/photos/13345924/pexels-photo-13345924.jpeg?w=400"
        ],
        category: "mobiles",
        brand: "Apple",
        price: 999.99,
        discount: 5,
        rating: 4.9,
        countInStock: 25,
        gender: "unisex",
        sizes: ["128GB", "256GB", "512GB", "1TB"]
    },
    {
        title: "Samsung Galaxy S23 Ultra",
        description: "Samsung Galaxy S23 Ultra with 200MP camera, S Pen included, and Snapdragon 8 Gen 2 processor.",
        mainImg: "https://images.pexels.com/photos/14784750/pexels-photo-14784750.jpeg?w=400",
        carousel: [
            "https://images.pexels.com/photos/14784750/pexels-photo-14784750.jpeg?w=400",
            "https://images.pexels.com/photos/14784751/pexels-photo-14784751.jpeg?w=400"
        ],
        category: "mobiles",
        brand: "Samsung",
        price: 1199.99,
        discount: 10,
        rating: 4.8,
        countInStock: 20,
        gender: "unisex",
        sizes: ["256GB", "512GB", "1TB"]
    },
    {
        title: "Google Pixel 7 Pro",
        description: "Google Pixel 7 Pro with Tensor G2 chip, amazing camera, and pure Android experience.",
        mainImg: "https://images.pexels.com/photos/13451252/pexels-photo-13451252.jpeg?w=400",
        category: "mobiles",
        brand: "Google",
        price: 899.99,
        discount: 15,
        rating: 4.7,
        countInStock: 30,
        gender: "unisex",
        sizes: ["128GB", "256GB", "512GB"]
    },

    // 💻 Laptops
    {
        title: "MacBook Pro 16",
        description: "Apple MacBook Pro with M2 Pro chip, 16-inch Liquid Retina XDR display, and up to 22 hours battery life.",
        mainImg: "https://images.pexels.com/photos/12904989/pexels-photo-12904989.jpeg?w=400",
        category: "laptops",
        brand: "Apple",
        price: 2499.99,
        discount: 0,
        rating: 4.9,
        countInStock: 15,
        gender: "unisex",
        sizes: ["512GB", "1TB", "2TB", "4TB"]
    },
    {
        title: "Dell XPS 15",
        description: "Dell XPS 15 with Intel i9 processor, NVIDIA RTX graphics, and 4K OLED display.",
        mainImg: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?w=400",
        category: "laptops",
        brand: "Dell",
        price: 1999.99,
        discount: 10,
        rating: 4.7,
        countInStock: 18,
        gender: "unisex",
        sizes: ["512GB", "1TB", "2TB"]
    },
    {
        title: "ASUS ROG Zephyrus",
        description: "ASUS ROG Zephyrus gaming laptop with AMD Ryzen 9, RTX 3080, and 165Hz display.",
        mainImg: "https://images.pexels.com/photos/205432/pexels-photo-205432.jpeg?w=400",
        category: "laptops",
        brand: "ASUS",
        price: 2199.99,
        discount: 12,
        rating: 4.8,
        countInStock: 12,
        gender: "unisex",
        sizes: ["1TB", "2TB"]
    },

    // 👕 Fashion
    {
        title: "Levi's 501 Original Jeans",
        description: "Classic straight-fit jeans. The original blue jeans since 1873.",
        mainImg: "https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?w=400",
        category: "fashion",
        brand: "Levi's",
        price: 89.99,
        discount: 20,
        rating: 4.8,
        countInStock: 100,
        gender: "men",
        sizes: ["28", "30", "32", "34", "36", "38"]
    },
    {
        title: "Zara Oversized T-Shirt",
        description: "Cotton oversized t-shirt with relaxed fit. Perfect for casual wear.",
        mainImg: "https://images.pexels.com/photos/6311370/pexels-photo-6311370.jpeg?w=400",
        category: "fashion",
        brand: "Zara",
        price: 29.99,
        discount: 0,
        rating: 4.5,
        countInStock: 150,
        gender: "women",
        sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
        title: "H&M Hoodie",
        description: "Comfortable cotton-blend hoodie with kangaroo pocket.",
        mainImg: "https://images.pexels.com/photos/6858583/pexels-photo-6858583.jpeg?w=400",
        category: "fashion",
        brand: "H&M",
        price: 39.99,
        discount: 15,
        rating: 4.6,
        countInStock: 80,
        gender: "unisex",
        sizes: ["S", "M", "L", "XL", "XXL"]
    },

    // 🧢 Fashion Accessories
    {
        title: "Ray-Ban Aviator Sunglasses",
        description: "Classic aviator style with metal frame and UV protection. Timeless design.",
        mainImg: "https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?w=400",
        category: "fashion-accessories",
        brand: "Ray-Ban",
        price: 159.99,
        discount: 10,
        rating: 4.8,
        countInStock: 55,
        gender: "unisex",
        sizes: ["One Size"]
    },
    {
        title: "Gucci Leather Belt",
        description: "Premium leather belt with signature GG buckle. Made in Italy.",
        mainImg: "https://images.pexels.com/photos/3649765/pexels-photo-3649765.jpeg?w=400",
        category: "fashion-accessories",
        brand: "Gucci",
        price: 399.99,
        discount: 15,
        rating: 4.9,
        countInStock: 25,
        gender: "men",
        sizes: ["30", "32", "34", "36", "38", "40"]
    },
    {
        title: "Silk Scarf",
        description: "Luxury silk scarf with elegant print. Versatile accessory for any outfit.",
        mainImg: "https://images.pexels.com/photos/2217083/pexels-photo-2217083.jpeg?w=400",
        category: "fashion-accessories",
        brand: "Hermès",
        price: 299.99,
        discount: 5,
        rating: 4.7,
        countInStock: 40,
        gender: "women",
        sizes: ["One Size"]
    },

    // ⌚ Watches
    {
        title: "Rolex Submariner",
        description: "Luxury dive watch with automatic movement and ceramic bezel.",
        mainImg: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?w=400",
        category: "watches",
        brand: "Rolex",
        price: 9999.99,
        discount: 0,
        rating: 5.0,
        countInStock: 5,
        gender: "men",
        sizes: ["One Size"]
    },
    {
        title: "Apple Watch Series 8",
        description: "Smartwatch with health tracking, GPS, and cellular connectivity.",
        mainImg: "https://images.pexels.com/photos/437036/pexels-photo-437036.jpeg?w=400",
        category: "watches",
        brand: "Apple",
        price: 399.99,
        discount: 5,
        rating: 4.8,
        countInStock: 50,
        gender: "unisex",
        sizes: ["41mm", "45mm"]
    },
    {
        title: "Fossil Gen 6",
        description: "Hybrid smartwatch with classic analog design and fitness tracking.",
        mainImg: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?w=400",
        category: "watches",
        brand: "Fossil",
        price: 249.99,
        discount: 20,
        rating: 4.6,
        countInStock: 35,
        gender: "unisex",
        sizes: ["One Size"]
    },

    // 🏀 Sports Equipment
    {
        title: "Wilson NBA Basketball",
        description: "Official size basketball with premium grip. Used in NBA games.",
        mainImg: "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?w=400",
        category: "sports-equipment",
        brand: "Wilson",
        price: 49.99,
        discount: 0,
        rating: 4.7,
        countInStock: 60,
        gender: "unisex",
        sizes: ["Size 7"]
    },
    {
        title: "Nike Football",
        description: "Official size and weight, perfect for games and practice.",
        mainImg: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?w=400",
        category: "sports-equipment",
        brand: "Nike",
        price: 34.99,
        discount: 10,
        rating: 4.7,
        countInStock: 70,
        gender: "unisex",
        sizes: ["Size 5"]
    },
    {
        title: "Babolat Tennis Racket",
        description: "Lightweight carbon fiber racket, pre-strung with durable strings.",
        mainImg: "https://images.pexels.com/photos/4389/sport-tennis-racket-sports-equipment.jpg?w=400",
        category: "sports-equipment",
        brand: "Babolat",
        price: 129.99,
        discount: 15,
        rating: 4.8,
        countInStock: 35,
        gender: "unisex",
        sizes: ["4 3/8", "4 1/2", "4 5/8"]
    },

    // 📿 Bracelets
    {
        title: "Gold Chain Bracelet",
        description: "14k gold chain bracelet with lobster clasp. Classic and elegant.",
        mainImg: "https://images.pexels.com/photos/2390794/pexels-photo-2390794.jpeg?w=400",
        category: "bracelets",
        brand: "Tiffany & Co.",
        price: 599.99,
        discount: 5,
        rating: 4.9,
        countInStock: 15,
        gender: "women",
        sizes: ["6.5in", "7in", "7.5in", "8in"]
    },
    {
        title: "Leather Wrap Bracelet",
        description: "Handmade leather bracelet with adjustable wrap design. Casual and stylish.",
        mainImg: "https://images.pexels.com/photos/3649766/pexels-photo-3649766.jpeg?w=400",
        category: "bracelets",
        brand: "Pandora",
        price: 79.99,
        discount: 15,
        rating: 4.6,
        countInStock: 60,
        gender: "unisex",
        sizes: ["One Size"]
    },
    {
        title: "Silver Beaded Bracelet",
        description: "Sterling silver beaded bracelet with charm accents. Perfect for stacking.",
        mainImg: "https://images.pexels.com/photos/2217083/pexels-photo-2217083.jpeg?w=400",
        category: "bracelets",
        brand: "Swarovski",
        price: 129.99,
        discount: 10,
        rating: 4.7,
        countInStock: 45,
        gender: "women",
        sizes: ["7in", "7.5in", "8in"]
    },

    // 🛒 Grocery
    {
        title: "Organic Coffee Beans",
        description: "Fair trade organic coffee beans, medium roast. 1kg bag.",
        mainImg: "https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg?w=400",
        category: "grocery",
        brand: "Starbucks",
        price: 24.99,
        discount: 10,
        rating: 4.8,
        countInStock: 100,
        gender: "unisex",
        sizes: ["1kg"]
    },
    {
        title: "Premium Olive Oil",
        description: "Extra virgin olive oil from Italy. Cold pressed, 500ml bottle.",
        mainImg: "https://images.pexels.com/photos/41967/olive-oil-oil-food-41967.jpeg?w=400",
        category: "grocery",
        brand: "Bertolli",
        price: 19.99,
        discount: 5,
        rating: 4.7,
        countInStock: 80,
        gender: "unisex",
        sizes: ["500ml"]
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing products (optional - comment out if you want to keep existing)
        await Product.deleteMany({});
        console.log('🗑️ Cleared existing products');

        // Insert sample products
        const inserted = await Product.insertMany(sampleProducts);
        console.log(`✅ Added ${inserted.length} products to database`);

        // Update admin categories
        let admin = await Admin.findOne();
        if (!admin) {
            admin = new Admin({ banner: '', categories: [] });
        }

        // Get unique categories from inserted products
        const categories = [...new Set(sampleProducts.map(p => p.category))];
        
        // Add any missing categories
        categories.forEach(category => {
            if (!admin.categories.includes(category)) {
                admin.categories.push(category);
                console.log(`➕ Added category: ${category}`);
            }
        });

        await admin.save();

        // Display summary
        console.log('\n📊 CATEGORY SUMMARY:');
        for (const category of categories) {
            const count = await Product.countDocuments({ category });
            console.log(`   • ${category}: ${count} products`);
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n🌐 Test these URLs:');
        console.log('   http://localhost:3000/');
        console.log('   http://localhost:3000/category/shoes');
        console.log('   http://localhost:3000/category/mobiles');
        console.log('   http://localhost:3000/category/fashion');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n📡 Database connection closed');
    }
};

// Run the seeder
seedDatabase();