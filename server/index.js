import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Admin, Cart, Orders, Product, User } from './Schema.js';

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = 6001;
const MONGO_URI = 'mongodb://localhost:27017/shopEZ';

// ============================================
// 📦 CONNECT TO MONGODB
// ============================================
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    
    // Initialize admin if not exists
    initializeAdmin();
    
    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server running @ http://localhost:${PORT}`);
        console.log(`📝 API Routes ready!`);
    });
}).catch((e) => console.log(`❌ Error in db connection: ${e}`));

// ============================================
// 🔧 INITIALIZE ADMIN
// ============================================
const initializeAdmin = async () => {
    try {
        const adminExists = await Admin.findOne();
        if (!adminExists) {
            const defaultCategories = [
                'electronics', 'mobiles', 'laptops', 'fashion', 
                'shoes', 'watches', 'bags', 'sports', 'grocery',
                'fashion-accessories', 'bracelets', 'sports-equipment'
            ];
            const newAdmin = new Admin({ 
                banner: 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?w=1200',
                categories: defaultCategories 
            });
            await newAdmin.save();
            console.log('✅ Admin initialized with default categories');
        }
    } catch (error) {
        console.error('❌ Error initializing admin:', error);
    }
};

// ============================================
// 👤 USER AUTHENTICATION ROUTES
// ============================================

// 📝 REGISTER new user
app.post('/register', async (req, res) => {
    const { username, email, usertype, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username, 
            email, 
            usertype: usertype || 'customer', 
            password: hashedPassword
        });

        const userCreated = await newUser.save();
        
        // Don't send password back
        const userResponse = userCreated.toObject();
        delete userResponse.password;
        
        return res.status(201).json({ 
            success: true, 
            message: 'Registration successful',
            data: userResponse 
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// 🔐 LOGIN user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        // Don't send password back
        const userResponse = user.toObject();
        delete userResponse.password;
        
        return res.json({ 
            success: true, 
            message: 'Login successful',
            data: userResponse 
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// ============================================
// 🖼️ ADMIN & BANNER ROUTES
// ============================================

// 🏞️ Fetch banner
app.get('/fetch-banner', async (req, res) => {
    try {
        const admin = await Admin.findOne();
        res.json({ success: true, data: admin?.banner || '' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
});

// 📋 Fetch all users (admin only - should add auth)
app.get('/fetch-users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
});

// 🏷️ Fetch categories
app.get('/fetch-categories', async (req, res) => {
    try {
        const admin = await Admin.findOne();
        res.json({ success: true, data: admin?.categories || [] });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// 🖼️ Update banner (admin only)
app.post('/update-banner', async (req, res) => {
    const { banner } = req.body;
    
    if (!banner) {
        return res.status(400).json({ success: false, message: 'Banner URL required' });
    }
    
    try {
        let admin = await Admin.findOne();
        if (!admin) {
            admin = new Admin({ banner, categories: [] });
        } else {
            admin.banner = banner;
        }
        await admin.save();
        res.json({ success: true, message: "Banner updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// ============================================
// 📦 PRODUCT ROUTES
// ============================================

// 📥 Fetch all products with filters
app.get('/fetch-products', async (req, res) => {
    try {
        const { category, brand, minPrice, maxPrice, sort, limit } = req.query;
        
        let query = {};
        
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
        let products = Product.find(query);
        
        // Sorting
        if (sort) {
            switch(sort) {
                case 'price_low': products = products.sort({ price: 1 }); break;
                case 'price_high': products = products.sort({ price: -1 }); break;
                case 'popular': products = products.sort({ rating: -1 }); break;
                case 'newest': products = products.sort({ createdAt: -1 }); break;
                default: products = products.sort({ createdAt: -1 });
            }
        }
        
        if (limit) {
            products = products.limit(Number(limit));
        }
        
        const result = await products;
        res.json({ success: true, data: result, count: result.length });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
});

// 🔍 Fetch individual product by ID
app.get('/fetch-product-details/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// ➕ Add new product (admin only)
app.post('/add-new-product', async (req, res) => {
    const { 
        productName, productDescription, productMainImg, 
        productCarousel, productSizes, productGender, 
        productCategory, productNewCategory, productPrice, 
        productDiscount, productBrand, productRating, productStock 
    } = req.body;
    
    // Validation
    if (!productName || !productDescription || !productMainImg || !productPrice) {
        return res.status(400).json({ success: false, message: 'Required fields missing' });
    }
    
    try {
        let finalCategory = productCategory;
        
        // Handle new category
        if (productCategory === 'new category' && productNewCategory) {
            finalCategory = productNewCategory.toLowerCase().replace(/\s+/g, '-');
            
            // Add to admin categories if new
            const admin = await Admin.findOne();
            if (admin && !admin.categories.includes(finalCategory)) {
                admin.categories.push(finalCategory);
                await admin.save();
            }
        }
        
        const newProduct = new Product({
            title: productName,
            description: productDescription,
            mainImg: productMainImg,
            carousel: productCarousel || [],
            category: finalCategory,
            sizes: productSizes || [],
            gender: productGender || '',
            price: Number(productPrice),
            discount: Number(productDiscount) || 0,
            brand: productBrand || '',
            rating: Number(productRating) || 4.5,
            countInStock: Number(productStock) || 10
        });

        await newProduct.save();
        res.json({ success: true, message: "Product added successfully!", data: newProduct });
    } catch (err) {
        console.error('Add product error:', err);
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// ✏️ Update product (admin only)
app.put('/update-product/:id', async (req, res) => {
    const { id } = req.params;
    const { 
        productName, productDescription, productMainImg, 
        productCarousel, productSizes, productGender, 
        productCategory, productNewCategory, productPrice, 
        productDiscount, productBrand, productRating, productStock 
    } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        let finalCategory = productCategory;
        
        // Handle new category
        if (productCategory === 'new category' && productNewCategory) {
            finalCategory = productNewCategory.toLowerCase().replace(/\s+/g, '-');
            
            // Add to admin categories if new
            const admin = await Admin.findOne();
            if (admin && !admin.categories.includes(finalCategory)) {
                admin.categories.push(finalCategory);
                await admin.save();
            }
        }
        
        // Update fields
        product.title = productName || product.title;
        product.description = productDescription || product.description;
        product.mainImg = productMainImg || product.mainImg;
        product.carousel = productCarousel || product.carousel;
        product.category = finalCategory || product.category;
        product.sizes = productSizes || product.sizes;
        product.gender = productGender || product.gender;
        product.price = Number(productPrice) || product.price;
        product.discount = Number(productDiscount) || product.discount;
        product.brand = productBrand || product.brand;
        product.rating = Number(productRating) || product.rating;
        product.countInStock = Number(productStock) || product.countInStock;

        await product.save();
        res.json({ success: true, message: "Product updated successfully!", data: product });
    } catch (err) {
        console.error('Update product error:', err);
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// 🗑️ Delete product (admin only)
app.delete('/delete-product/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// ============================================
// 🆕 CATEGORY API ROUTES
// ============================================

// 📊 GET ALL CATEGORIES WITH PRODUCT COUNTS
app.get('/fetch-categories-with-counts', async (req, res) => {
    try {
        console.log("🔍 Fetching categories with counts...");
        
        const admin = await Admin.findOne();
        let categories = admin?.categories || [];
        
        const categoriesWithCounts = [];
        
        for (let category of categories) {
            const count = await Product.countDocuments({ category });
            categoriesWithCounts.push({
                name: category,
                count: count
            });
        }
        
        res.json({ success: true, data: categoriesWithCounts });
    } catch (err) {
        console.error("❌ Error fetching categories:", err);
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
});

// 📦 GET PRODUCTS BY CATEGORY NAME (case-insensitive)
app.get('/fetch-products-by-category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        
        console.log(`🔍 Fetching products for category: ${category}`);
        
        // Case-insensitive search
        const products = await Product.find({ 
            category: { $regex: new RegExp(`^${category}$`, 'i') } 
        });
        
        res.json({
            success: true,
            category: category,
            count: products.length,
            data: products
        });
    } catch (err) {
        console.error("❌ Error fetching products by category:", err);
        res.status(500).json({
            success: false,
            message: 'Error occurred'
        });
    }
});

// 📋 GET CATEGORY DETAILS
app.get('/fetch-category-details/:category', async (req, res) => {
    try {
        const { category } = req.params;
        
        console.log(`🔍 Fetching details for category: ${category}`);
        
        const products = await Product.find({ 
            category: { $regex: new RegExp(`^${category}$`, 'i') } 
        });
        
        // Get unique brands
        const brands = [...new Set(products.map(p => p.brand).filter(b => b))];
        
        // Get price range
        let minPrice = 0, maxPrice = 10000;
        if (products.length > 0) {
            const prices = products.map(p => p.price);
            minPrice = Math.min(...prices);
            maxPrice = Math.max(...prices);
        }
        
        res.json({
            success: true,
            category: category,
            brands: brands,
            priceRange: { min: minPrice, max: maxPrice },
            productCount: products.length
        });
    } catch (err) {
        console.error("❌ Error fetching category details:", err);
        res.status(500).json({
            success: false,
            message: 'Error occurred'
        });
    }
});

// 🔍 SEARCH PRODUCTS
app.get('/search-products', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === '') {
            return res.json({ success: true, data: [] });
        }
        
        const searchTerm = q.trim();
        console.log(`🔍 Searching for: ${searchTerm}`);
        
        // Search in multiple fields
        const products = await Product.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
                { brand: { $regex: searchTerm, $options: 'i' } }
            ]
        }).limit(50);
        
        res.json({ 
            success: true, 
            data: products,
            count: products.length,
            query: searchTerm
        });
    } catch (err) {
        console.error("❌ Error searching products:", err);
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
});

// ⭐ GET FEATURED PRODUCTS
app.get('/fetch-featured-products', async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 8;
        
        const products = await Product.find()
            .sort({ rating: -1, createdAt: -1 })
            .limit(limit);
        
        res.json({ success: true, data: products });
    } catch (err) {
        console.error("❌ Error fetching featured products:", err);
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
});

// ============================================
// 🛒 CART ROUTES
// ============================================

// 🛍️ Fetch cart items for a user
app.get('/fetch-cart/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const items = await Cart.find({ userId }).sort({ addedAt: -1 });
        res.json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// ➕ Add to cart
app.post('/add-to-cart', async (req, res) => {
    const { userId, title, description, mainImg, size, quantity, price, discount } = req.body;
    
    if (!userId || !title || !price) {
        return res.status(400).json({ success: false, message: 'Required fields missing' });
    }
    
    try {
        // Check if item already in cart
        const existingItem = await Cart.findOne({ 
            userId, 
            title, 
            size: size || null 
        });
        
        if (existingItem) {
            // Update quantity
            existingItem.quantity += Number(quantity) || 1;
            await existingItem.save();
            res.json({ success: true, message: 'Cart updated', data: existingItem });
        } else {
            // Add new item
            const item = new Cart({ 
                userId, 
                title, 
                description, 
                mainImg, 
                size, 
                quantity: Number(quantity) || 1, 
                price: Number(price), 
                discount: Number(discount) || 0 
            });
            await item.save();
            res.json({ success: true, message: 'Added to cart', data: item });
        }
    } catch (err) {
        console.error('Add to cart error:', err);
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// 📈 Increase cart quantity
app.put('/increase-cart-quantity', async (req, res) => {
    const { id } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid item ID' });
    }
    
    try {
        const item = await Cart.findById(id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        item.quantity += 1;
        await item.save();
        res.json({ success: true, message: 'Quantity increased', data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// 📉 Decrease cart quantity
app.put('/decrease-cart-quantity', async (req, res) => {
    const { id } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid item ID' });
    }
    
    try {
        const item = await Cart.findById(id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        
        if (item.quantity > 1) {
            item.quantity -= 1;
            await item.save();
            res.json({ success: true, message: 'Quantity decreased', data: item });
        } else {
            // Remove item if quantity would become 0
            await Cart.deleteOne({ _id: id });
            res.json({ success: true, message: 'Item removed' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// 🗑️ Remove from cart
app.delete('/remove-cart-item/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid item ID' });
    }
    
    try {
        await Cart.deleteOne({ _id: id });
        res.json({ success: true, message: 'Item removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// 🧹 Clear user cart
app.delete('/clear-cart/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        await Cart.deleteMany({ userId });
        res.json({ success: true, message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// ============================================
// 📦 ORDER ROUTES
// ============================================

// 📋 Fetch orders for a user
app.get('/fetch-orders/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const orders = await Orders.find({ userId }).sort({ orderDate: -1 });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
});

// 📋 Fetch all orders (admin)
app.get('/fetch-all-orders', async (req, res) => {
    try {
        const orders = await Orders.find().sort({ orderDate: -1 });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
});

// 💳 Buy product directly
app.post('/buy-product', async (req, res) => {
    const { 
        userId, name, email, mobile, address, pincode, 
        title, description, mainImg, size, quantity, 
        price, discount, paymentMethod 
    } = req.body;
    
    // Validation
    if (!userId || !name || !email || !mobile || !address || !pincode || !title || !price || !paymentMethod) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    try {
        const newOrder = new Orders({ 
            userId, name, email, mobile, address, pincode, 
            title, description, mainImg, size, 
            quantity: Number(quantity) || 1, 
            price: Number(price), 
            discount: Number(discount) || 0, 
            paymentMethod,
            orderDate: new Date()
        });
        
        await newOrder.save();
        res.json({ success: true, message: 'Order placed successfully', data: newOrder });
    } catch (err) {
        console.error('Buy product error:', err);
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// ❌ Cancel order
app.put('/cancel-order/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }
    
    try {
        const order = await Orders.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        if (order.orderStatus === 'delivered') {
            return res.status(400).json({ success: false, message: 'Cannot cancel delivered order' });
        }
        
        if (order.orderStatus === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Order already cancelled' });
        }
        
        order.orderStatus = 'cancelled';
        await order.save();
        res.json({ success: true, message: 'Order cancelled', data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// 🔄 Update order status (admin)
app.put('/update-order-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }
    
    const validStatuses = ['order placed', 'processing', 'in-transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    try {
        const order = await Orders.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        order.orderStatus = status;
        
        // Set delivery date if delivered
        if (status === 'delivered') {
            order.deliveryDate = new Date();
        }
        
        await order.save();
        res.json({ success: true, message: 'Order status updated', data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// 🛒 Place order from cart
app.post('/place-cart-order', async (req, res) => {
    const { userId, name, mobile, email, address, pincode, paymentMethod } = req.body;
    
    if (!userId || !name || !mobile || !email || !address || !pincode || !paymentMethod) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    try {
        const cartItems = await Cart.find({ userId });
        
        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }
        
        const orderPromises = cartItems.map(async (item) => {
            const newOrder = new Orders({
                userId, name, email, mobile, address, pincode,
                title: item.title, 
                description: item.description, 
                mainImg: item.mainImg,
                size: item.size, 
                quantity: item.quantity, 
                price: item.price,
                discount: item.discount || 0, 
                paymentMethod,
                orderDate: new Date()
            });
            return newOrder.save();
        });
        
        await Promise.all(orderPromises);
        await Cart.deleteMany({ userId });
        
        res.json({ success: true, message: 'Order placed successfully' });
    } catch (err) {
        console.error('Place order error:', err);
        res.status(500).json({ success: false, message: "Error occurred" });
    }
});

// ============================================
// 📊 DASHBOARD STATS (admin)
// ============================================
app.get('/admin-stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments({ usertype: 'customer' });
        const productCount = await Product.countDocuments();
        const orderCount = await Orders.countDocuments();
        
        res.json({ 
            success: true, 
            data: {
                users: userCount,
                products: productCount,
                orders: orderCount
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
});