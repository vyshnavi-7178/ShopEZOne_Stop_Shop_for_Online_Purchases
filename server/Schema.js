import mongoose from "mongoose";

// 👤 USER SCHEMA
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    createdAt: { type: Date, default: Date.now }
});

// 👑 ADMIN SCHEMA
const adminSchema = new mongoose.Schema({
    banner: { type: String, default: '' },
    categories: { type: Array, default: [] }
});

// 📦 PRODUCT SCHEMA
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainImg: { type: String, required: true },
    carousel: { type: Array, default: [] },
    sizes: { type: Array, default: [] },
    category: { type: String, required: true },
    gender: { type: String, enum: ['men', 'women', 'unisex', ''], default: '' },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    brand: { type: String, default: '' },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    countInStock: { type: Number, default: 10 },
    createdAt: { type: Date, default: Date.now }
});

// 📝 ORDER SCHEMA
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainImg: { type: String, required: true },
    size: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    orderStatus: { 
        type: String, 
        enum: ['order placed', 'processing', 'in-transit', 'delivered', 'cancelled'],
        default: 'order placed' 
    }
});

// 🛒 CART SCHEMA
const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainImg: { type: String, required: true },
    size: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    addedAt: { type: Date, default: Date.now }
});

// ✅ CREATE MODELS
const User = mongoose.model('users', userSchema);
const Admin = mongoose.model('admin', adminSchema);
const Product = mongoose.model('products', productSchema);
const Orders = mongoose.model('orders', orderSchema);
const Cart = mongoose.model('cart', cartSchema);

// ✅ EXPORT ALL MODELS
export { User, Admin, Product, Orders, Cart };``