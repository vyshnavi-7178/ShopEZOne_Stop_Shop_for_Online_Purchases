import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FlashSale from '../components/FlashSale';
import { getCategoryIcon, getDiscountedPrice, renderStars } from '../utils/productUtils';

const Home = () => {
  const [banner, setBanner] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:6001';

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      // Fetch banner
      try {
        const bannerRes = await axios.get(`${API_BASE}/fetch-banner`);
        if (bannerRes.data.success) {
          setBanner(bannerRes.data.data);
        }
      } catch (error) {
        console.log('No banner found, using default');
        setBanner('https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?w=1200');
      }

      // Fetch categories with counts
      try {
        const categoriesRes = await axios.get(`${API_BASE}/fetch-categories-with-counts`);
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }

      // Fetch featured products
      try {
        const productsRes = await axios.get(`${API_BASE}/fetch-featured-products?limit=8`);
        if (productsRes.data.success) {
          setFeaturedProducts(productsRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    heroBanner: {
      position: 'relative',
      height: '500px',
      overflow: 'hidden'
    },
    bannerImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    bannerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    bannerContent: {
      textAlign: 'center',
      color: 'white'
    },
    bannerTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    bannerSubtitle: {
      fontSize: '20px',
      marginBottom: '30px'
    },
    bannerButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center'
    },
    bannerBtn: {
      padding: '12px 30px',
      fontSize: '16px',
      borderRadius: '25px',
      textDecoration: 'none',
      transition: 'transform 0.3s'
    },
    primaryBtn: {
      backgroundColor: '#667eea',
      color: 'white'
    },
    secondaryBtn: {
      backgroundColor: 'white',
      color: '#333'
    },
    section: {
      padding: '60px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    sectionTitle: {
      fontSize: '36px',
      color: '#333',
      marginBottom: '10px'
    },
    sectionSubtitle: {
      fontSize: '18px',
      color: '#666'
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '20px',
      marginTop: '30px'
    },
    categoryCard: {
      backgroundColor: 'white',
      padding: '30px 20px',
      borderRadius: '8px',
      textAlign: 'center',
      textDecoration: 'none',
      color: '#333',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s'
    },
    categoryIcon: {
      fontSize: '40px',
      marginBottom: '15px'
    },
    categoryName: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '5px'
    },
    categoryCount: {
      fontSize: '14px',
      color: '#666'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px'
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
      width: '100%',
      height: '200px',
      objectFit: 'cover'
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
    stars: {
      color: '#ffc107'
    },
    ratingValue: {
      fontSize: '14px',
      color: '#666'
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
    offerBanner: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center'
    },
    offerTitle: {
      fontSize: '36px',
      marginBottom: '15px'
    },
    offerSubtitle: {
      fontSize: '18px',
      marginBottom: '30px'
    },
    offerBtn: {
      padding: '12px 30px',
      backgroundColor: 'white',
      color: '#667eea',
      textDecoration: 'none',
      borderRadius: '25px',
      fontWeight: '600',
      display: 'inline-block'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '50px'
    },
    errorContainer: {
      textAlign: 'center',
      padding: '50px',
      color: '#ff6b6b'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchHomeData} style={styles.primaryBtn}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <section style={styles.heroBanner}>
        <img
          src={banner}
          alt="ShopEZ Banner"
          style={styles.bannerImage}
          onError={(e) => {
            e.target.src = 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?w=1200';
          }}
        />
        <div style={styles.bannerOverlay}>
          <div style={styles.bannerContent}>
            <h1 style={styles.bannerTitle}>Welcome to ShopEZ! 🎉</h1>
            <p style={styles.bannerSubtitle}>Your one-stop destination for everything you need</p>
            <div style={styles.bannerButtons}>
              <Link
                to="/category/electronics"
                style={{ ...styles.bannerBtn, ...styles.primaryBtn }}
              >
                Shop Electronics 💻
              </Link>
              <Link
                to="/category/fashion"
                style={{ ...styles.bannerBtn, ...styles.secondaryBtn }}
              >
                Explore Fashion 👕
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <FlashSale />

      {/* Featured Categories */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Shop by Categories</h2>
          <p style={styles.sectionSubtitle}>Find what you're looking for</p>
        </div>

        <div style={styles.categoriesGrid}>
          {categories.slice(0, 8).map((category) => (
            <Link
              to={`/category/${category.name.toLowerCase()}`}
              key={category.name}
              style={styles.categoryCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.categoryIcon}>
                {getCategoryIcon(category.name)}
              </div>
              <h3 style={styles.categoryName}>{category.name}</h3>
              <p style={styles.categoryCount}>{category.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section style={{ ...styles.section, backgroundColor: '#f8f9fa' }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Products</h2>
            <p style={styles.sectionSubtitle}>Popular items you might like</p>
          </div>

          <div style={styles.productsGrid}>
            {featuredProducts.map((product) => (
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
                <div style={{ position: 'relative' }}>
                  <img
                    src={product.mainImg}
                    alt={product.title}
                    style={styles.productImage}
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
                    <span style={styles.ratingValue}>
                      ({product.rating})
                    </span>
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
        </section>
      )}

      {/* Special Offers Banner */}
      <section style={styles.offerBanner}>
        <div>
          <h2 style={styles.offerTitle}>Special Offers Just For You! 🎁</h2>
          <p style={styles.offerSubtitle}>Get up to 50% off on selected items</p>
          <Link to="/category/fashion" style={styles.offerBtn}>
            Shop Now →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;