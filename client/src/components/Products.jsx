// client/src/components/Products.jsx
// 🎯 THIS PAGE SHOWS ALL PRODUCTS WITH FILTERS ON LEFT, PRODUCTS ON RIGHT!

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Products.css';

const Products = () => {
    // 📦 State variables
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 🎛️ Filter states
    const [sortBy, setSortBy] = useState('popular');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedGender, setSelectedGender] = useState('all');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // ============================================
    // 📥 LOAD PRODUCTS WHEN PAGE OPENS
    // ============================================
    useEffect(() => {
        fetchProducts();
    }, []);

    // ============================================
    // 📥 FETCH ALL PRODUCTS
    // ============================================
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔍 Fetching all products...');
            
            const response = await axios.get('http://localhost:6001/fetch-products');
            
            console.log('✅ Response received:', response.data);
            
            if (response.data) {
                setProducts(response.data);
                setFilteredProducts(response.data);
                
                // Extract unique categories and brands
                const uniqueCategories = [...new Set(response.data.map(p => p.category))];
                const uniqueBrands = [...new Set(response.data.map(p => p.brand).filter(Boolean))];
                
                setCategories(uniqueCategories);
                setBrands(uniqueBrands);
                
                // Set price range
                const prices = response.data.map(p => p.price);
                setPriceRange({
                    min: Math.min(...prices),
                    max: Math.max(...prices)
                });
                
                console.log(`✅ Found ${response.data.length} products!`);
            }
            
        } catch (error) {
            console.error('❌ Error fetching products:', error);
            setError('Failed to load products. Make sure your backend is running!');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // 🎯 APPLY FILTERS
    // ============================================
    useEffect(() => {
        if (products.length > 0) {
            let filtered = [...products];
            
            // 1️⃣ FILTER BY CATEGORY
            if (selectedCategory !== 'all') {
                filtered = filtered.filter(p => p.category === selectedCategory);
            }
            
            // 2️⃣ FILTER BY GENDER
            if (selectedGender !== 'all') {
                filtered = filtered.filter(p => p.gender === selectedGender);
            }
            
            // 3️⃣ FILTER BY BRAND
            if (selectedBrands.length > 0) {
                filtered = filtered.filter(p => selectedBrands.includes(p.brand));
            }
            
            // 4️⃣ FILTER BY PRICE
            filtered = filtered.filter(p => 
                p.price >= priceRange.min && p.price <= priceRange.max
            );
            
            // 5️⃣ SORT PRODUCTS
            if (sortBy === 'price_low') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'price_high') {
                filtered.sort((a, b) => b.price - a.price);
            } else if (sortBy === 'discount') {
                filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
            } else if (sortBy === 'popular') {
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            }
            
            setFilteredProducts(filtered);
        }
    }, [products, sortBy, selectedCategory, selectedGender, selectedBrands, priceRange]);

    // ============================================
    // 🧹 CLEAR FILTERS
    // ============================================
    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedGender('all');
        setSelectedBrands([]);
        setSortBy('popular');
        
        // Reset price range
        if (products.length > 0) {
            const prices = products.map(p => p.price);
            setPriceRange({
                min: Math.min(...prices),
                max: Math.max(...prices)
            });
        }
    };

    // ============================================
    // 🏷️ HANDLE BRAND SELECTION
    // ============================================
    const handleBrandChange = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    // ============================================
    // ⭐ GENERATE STAR RATING
    // ============================================
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 4.5);
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push('★');
            } else {
                stars.push('☆');
            }
        }
        
        return stars.join('');
    };

    // ============================================
    // 💰 CALCULATE DISCOUNTED PRICE
    // ============================================
    const getDiscountedPrice = (price, discount) => {
        if (!discount || discount === 0) return price;
        return (price * (100 - discount) / 100).toFixed(2);
    };

    // ============================================
    // 🎨 RENDER THE PAGE
    // ============================================
    return (
        <div className="products-page">
            {/* 🏠 HEADER */}
            <div className="products-header">
                <div className="container">
                    <h1>All Products</h1>
                    <p className="product-count">
                        <span className="count">{filteredProducts.length}</span> products found
                    </p>
                </div>
            </div>

            <div className="container">
                {/* 📱 MOBILE FILTER TOGGLE */}
                <button 
                    className="filter-toggle-btn"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <span className="btn-text">
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </span>
                    <span className="btn-icon">{showFilters ? '▲' : '▼'}</span>
                </button>

                {/* 📐 MAIN LAYOUT - FILTERS LEFT, PRODUCTS RIGHT! */}
                <div className="products-layout">
                    
                    {/* 🎛️ FILTERS SIDEBAR - LEFT SIDE */}
                    <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                        <div className="filters-header">
                            <h3>Filters</h3>
                            <button 
                                onClick={clearFilters} 
                                className="clear-filters-btn"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* 🔽 SORT BY FILTER */}
                        <div className="filter-section">
                            <h4>Sort By</h4>
                            <div className="sort-options">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="sort"
                                        checked={sortBy === 'popular'}
                                        onChange={() => setSortBy('popular')}
                                    />
                                    <span className="radio-custom"></span>
                                    <span>Popular</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="sort"
                                        checked={sortBy === 'price_low'}
                                        onChange={() => setSortBy('price_low')}
                                    />
                                    <span className="radio-custom"></span>
                                    <span>Price: Low to High</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="sort"
                                        checked={sortBy === 'price_high'}
                                        onChange={() => setSortBy('price_high')}
                                    />
                                    <span className="radio-custom"></span>
                                    <span>Price: High to Low</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="sort"
                                        checked={sortBy === 'discount'}
                                        onChange={() => setSortBy('discount')}
                                    />
                                    <span className="radio-custom"></span>
                                    <span>Discount</span>
                                </label>
                            </div>
                        </div>

                        {/* 🏷️ CATEGORIES FILTER */}
                        {categories.length > 0 && (
                            <div className="filter-section">
                                <h4>Categories</h4>
                                <div className="category-options">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === 'all'}
                                            onChange={() => setSelectedCategory('all')}
                                        />
                                        <span className="radio-custom"></span>
                                        <span>All Categories</span>
                                    </label>
                                    {categories.map(category => (
                                        <label key={category} className="radio-label">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === category}
                                                onChange={() => setSelectedCategory(category)}
                                            />
                                            <span className="radio-custom"></span>
                                            <span className="category-name">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 👕 GENDER FILTER */}
                        <div className="filter-section">
                            <h4>Gender</h4>
                            <div className="gender-options">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={selectedGender === 'all'}
                                        onChange={() => setSelectedGender('all')}
                                    />
                                    <span className="radio-custom"></span>
                                    <span>All</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={selectedGender === 'men'}
                                        onChange={() => setSelectedGender('men')}
                                    />
                                    <span className="radio-custom"></span>
                                    <span>Men</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={selectedGender === 'women'}
                                        onChange={() => setSelectedGender('women')}
                                    />
                                    <span className="radio-custom"></span>
                                    <span>Women</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={selectedGender === 'unisex'}
                                        onChange={() => setSelectedGender('unisex')}
                                    />
                                    <span className="radio-custom"></span>
                                    <span>Unisex</span>
                                </label>
                            </div>
                        </div>

                        {/* 🏷️ BRANDS FILTER */}
                        {brands.length > 0 && (
                            <div className="filter-section">
                                <h4>Brands</h4>
                                <div className="brands-list">
                                    {brands.map(brand => (
                                        <label key={brand} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => handleBrandChange(brand)}
                                            />
                                            <span className="checkbox-custom"></span>
                                            <span className="brand-name">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 💰 PRICE RANGE FILTER */}
                        <div className="filter-section">
                            <h4>Price Range</h4>
                            <div className="price-inputs">
                                <div className="price-field">
                                    <label>Min ($)</label>
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({
                                            ...priceRange,
                                            min: Number(e.target.value)
                                        })}
                                        min="0"
                                    />
                                </div>
                                <span className="price-separator">—</span>
                                <div className="price-field">
                                    <label>Max ($)</label>
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({
                                            ...priceRange,
                                            max: Number(e.target.value)
                                        })}
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 📦 PRODUCTS MAIN CONTENT - RIGHT SIDE! */}
                    <div className="products-main">
                        
                        {/* ⏳ LOADING STATE */}
                        {loading && (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading products...</p>
                            </div>
                        )}

                        {/* ❌ ERROR STATE */}
                        {error && !loading && (
                            <div className="error-state">
                                <span className="error-icon">😕</span>
                                <h3>Oops! Something went wrong</h3>
                                <p>{error}</p>
                                <button onClick={fetchProducts} className="retry-btn">
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* 📦 PRODUCTS GRID */}
                        {!loading && !error && (
                            <>
                                {filteredProducts.length === 0 ? (
                                    <div className="no-products">
                                        <div className="no-products-icon">🔍</div>
                                        <h3>No products found</h3>
                                        <p>Try adjusting your filters!</p>
                                        <button onClick={clearFilters} className="clear-filters-btn">
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="products-grid">
                                        {filteredProducts.map(product => (
                                            <Link 
                                                to={`/product/${product._id}`} 
                                                key={product._id}
                                                className="product-card"
                                            >
                                                <div className="product-image">
                                                    <img 
                                                        src={product.mainImg || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=400'} 
                                                        alt={product.title}
                                                        onError={(e) => {
                                                            e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=400';
                                                        }}
                                                    />
                                                    {product.discount > 0 && (
                                                        <span className="discount-badge">
                                                            -{product.discount}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="product-info">
                                                    <h3 className="product-title">{product.title}</h3>
                                                    
                                                    {product.brand && (
                                                        <p className="product-brand">{product.brand}</p>
                                                    )}
                                                    
                                                    <div className="product-rating">
                                                        <span className="stars">
                                                            {renderStars(product.rating)}
                                                        </span>
                                                        <span className="rating-value">
                                                            ({product.rating || 4.5})
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="product-price">
                                                        {product.discount > 0 ? (
                                                            <>
                                                                <span className="current-price">
                                                                    ${getDiscountedPrice(product.price, product.discount)}
                                                                </span>
                                                                <span className="original-price">
                                                                    ${product.price}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="current-price">
                                                                ${product.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <button className="view-product-btn">
                                                        View Product
                                                    </button>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;