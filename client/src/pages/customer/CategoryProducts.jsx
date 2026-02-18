import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getDiscountedPrice, renderStars } from '../../utils/productUtils';

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const API_BASE = 'http://localhost:6001';

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [category]);

  useEffect(() => {
    applyFilters();
  }, [products, sortBy, priceRange, selectedBrands, selectedRating]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE}/fetch-products-by-category/${category}`
      );
      
      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        
        // Set price range based on products
        if (response.data.data.length > 0) {
          const prices = response.data.data.map(p => p.price);
          setPriceRange({
            min: Math.min(...prices),
            max: Math.max(...prices)
          });
        }
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Could not load products');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (products.length === 0) return;

    let filtered = [...products];

    // Filter by price
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filter by brand
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter(product =>
        product.rating >= selectedRating
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      setPriceRange({
        min: Math.min(...prices),
        max: Math.max(...prices)
      });
    }
    setSelectedBrands([]);
    setSelectedRating(0);
    setSortBy('popular');
  };

  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Get unique brands from products
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(b => b))];

  const formatCategoryName = (name) => {
    if (!name) return 'Products';
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      marginBottom: '30px'
    },
    breadcrumb: {
      marginBottom: '15px',
      fontSize: '14px',
      color: '#666'
    },
    breadcrumbLink: {
      color: '#667eea',
      textDecoration: 'none'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333'
    },
    productCount: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '20px'
    },
    
    // Filters Section - TOP of page
    filtersContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    },
    filterHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    filterTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333'
    },
    clearBtn: {
      padding: '5px 15px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    filterRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    filterSection: {
      padding: '10px'
    },
    filterSectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#333'
    },
    
    // Price Range
    priceInputs: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    priceField: {
      flex: 1
    },
    priceLabel: {
      display: 'block',
      fontSize: '12px',
      color: '#666',
      marginBottom: '5px'
    },
    priceInput: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    priceSeparator: {
      color: '#666'
    },
    
    // Brands
    brandList: {
      maxHeight: '150px',
      overflowY: 'auto'
    },
    brandItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
      cursor: 'pointer'
    },
    brandCheckbox: {
      marginRight: '10px',
      cursor: 'pointer'
    },
    brandName: {
      fontSize: '14px',
      color: '#333'
    },
    
    // Rating
    ratingItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
      cursor: 'pointer'
    },
    ratingRadio: {
      marginRight: '10px',
      cursor: 'pointer'
    },
    ratingText: {
      fontSize: '14px',
      color: '#333'
    },
    stars: {
      color: '#ffc107',
      marginLeft: '5px'
    },
    
    // Sort Bar
    sortBar: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    sortSelect: {
      padding: '8px 15px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      cursor: 'pointer',
      marginLeft: '10px'
    },
    
    // Products Grid - 3 in a row
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', // Exactly 3 columns
      gap: '20px',
      marginTop: '20px'
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'transform 0.3s'
    },
    productImage: {
      position: 'relative',
      height: '200px',
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    discountBadge: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600'
    },
    productInfo: {
      padding: '15px'
    },
    productTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '5px',
      color: '#333'
    },
    productBrand: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px'
    },
    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      marginBottom: '10px'
    },
    productPrice: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    },
    currentPrice: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#667eea'
    },
    originalPrice: {
      fontSize: '14px',
      color: '#999',
      textDecoration: 'line-through'
    },
    noProducts: {
      textAlign: 'center',
      padding: '50px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      gridColumn: 'span 3'
    },
    loading: {
      textAlign: 'center',
      padding: '50px'
    },
    error: {
      textAlign: 'center',
      padding: '50px',
      color: '#ff6b6b'
    },
    
    // Responsive for mobile
    '@media (max-width: 768px)': {
      filterRow: {
        gridTemplateColumns: '1fr'
      },
      productsGrid: {
        gridTemplateColumns: 'repeat(2, 1fr)' // 2 columns on tablet
      }
    },
    '@media (max-width: 480px)': {
      productsGrid: {
        gridTemplateColumns: '1fr' // 1 column on mobile
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchProducts} style={styles.clearBtn}>
          Try Again
        </button>
      </div>
    );
  }

  const displayName = formatCategoryName(category);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.breadcrumb}>
          <Link to="/" style={styles.breadcrumbLink}>Home</Link>
          <span> › </span>
          <span style={{ color: '#666' }}>{displayName}</span>
        </div>
        <h1 style={styles.title}>{displayName}</h1>
        <p style={styles.productCount}>
          <strong>{filteredProducts.length}</strong> products found
        </p>
      </div>

      {/* Filters Section - TOP of page */}
      {products.length > 0 && (
        <div style={styles.filtersContainer}>
          <div style={styles.filterHeader}>
            <h3 style={styles.filterTitle}>Filters</h3>
            <button 
              style={styles.clearBtn}
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>

          <div style={styles.filterRow}>
            {/* Price Range Filter */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Price Range</h4>
              <div style={styles.priceInputs}>
                <div style={styles.priceField}>
                  <label style={styles.priceLabel}>Min ($)</label>
                  <input
                    type="number"
                    style={styles.priceInput}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({
                      ...priceRange,
                      min: Number(e.target.value)
                    })}
                    min="0"
                  />
                </div>
                <span style={styles.priceSeparator}>-</span>
                <div style={styles.priceField}>
                  <label style={styles.priceLabel}>Max ($)</label>
                  <input
                    type="number"
                    style={styles.priceInput}
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

            {/* Brand Filter */}
            {uniqueBrands.length > 0 && (
              <div style={styles.filterSection}>
                <h4 style={styles.filterSectionTitle}>Brands</h4>
                <div style={styles.brandList}>
                  {uniqueBrands.map(brand => (
                    <label key={brand} style={styles.brandItem}>
                      <input
                        type="checkbox"
                        style={styles.brandCheckbox}
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                      />
                      <span style={styles.brandName}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Filter */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Rating</h4>
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} style={styles.ratingItem}>
                  <input
                    type="radio"
                    name="rating"
                    style={styles.ratingRadio}
                    checked={selectedRating === rating}
                    onChange={() => setSelectedRating(rating)}
                  />
                  <span style={styles.ratingText}>
                    {rating}+ <span style={styles.stars}>{'★'.repeat(rating)}</span>
                  </span>
                </label>
              ))}
              <label style={styles.ratingItem}>
                <input
                  type="radio"
                  name="rating"
                  style={styles.ratingRadio}
                  checked={selectedRating === 0}
                  onChange={() => setSelectedRating(0)}
                />
                <span style={styles.ratingText}>All Ratings</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Sort Bar */}
      {products.length > 0 && (
        <div style={styles.sortBar}>
          <div>
            <span>Sort by:</span>
            <select
              style={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">🔥 Popular</option>
              <option value="price_low">💰 Price: Low to High</option>
              <option value="price_high">💰 Price: High to Low</option>
              <option value="newest">🆕 Newest First</option>
            </select>
          </div>
        </div>
      )}

      {/* Products Grid - 3 in a row */}
      {filteredProducts.length === 0 ? (
        <div style={styles.noProducts}>
          <h3>No products found in {displayName}</h3>
          <p>Try adjusting your filters or check back later!</p>
          <Link to="/" style={{ color: '#667eea' }}>
            ← Back to Home
          </Link>
        </div>
      ) : (
        <div style={styles.productsGrid}>
          {filteredProducts.map(product => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              style={styles.productCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.productImage}>
                <img
                  src={product.mainImg}
                  alt={product.title}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=400';
                  }}
                />
                {product.discount > 0 && (
                  <span style={styles.discountBadge}>
                    -{product.discount}%
                  </span>
                )}
              </div>
              <div style={styles.productInfo}>
                <h3 style={styles.productTitle}>{product.title}</h3>
                {product.brand && (
                  <p style={styles.productBrand}>{product.brand}</p>
                )}
                <div style={styles.productRating}>
                  <span style={styles.stars}>
                    {renderStars(product.rating)}
                  </span>
                  <span>({product.rating})</span>
                </div>
                <div style={styles.productPrice}>
                  <span style={styles.currentPrice}>
                    ${getDiscountedPrice(product.price, product.discount)}
                  </span>
                  {product.discount > 0 && (
                    <span style={styles.originalPrice}>
                      ${product.price}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;