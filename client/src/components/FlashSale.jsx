import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FlashSale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashSaleProducts();
  }, []);

  const fetchFlashSaleProducts = async () => {
    try {
      // Get products with high discounts
      const response = await axios.get('http://localhost:6001/fetch-products?sort=discount&limit=4');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching flash sale products:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '40px 20px',
      backgroundColor: '#f8f9fa'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
      textAlign: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit'
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    content: {
      padding: '15px'
    },
    productTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '5px',
      color: '#333'
    },
    description: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px'
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap'
    },
    price: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#ff6b6b'
    },
    originalPrice: {
      fontSize: '14px',
      color: '#999',
      textDecoration: 'line-through'
    },
    discount: {
      fontSize: '14px',
      color: '#28a745',
      fontWeight: '600'
    },
    loading: {
      textAlign: 'center',
      padding: '20px'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>⚡ Flash Sale ⚡</h2>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚡ Flash Sale ⚡</h2>
      <div style={styles.grid}>
        {products.map(product => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}
          >
            <img src={product.mainImg} alt={product.title} style={styles.image} />
            <div style={styles.content}>
              <h3 style={styles.productTitle}>{product.title}</h3>
              <p style={styles.description}>{product.description}</p>
              <div style={styles.priceContainer}>
                <span style={styles.price}>
                  ${(product.price * (100 - (product.discount || 0)) / 100).toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span style={styles.originalPrice}>${product.price}</span>
                    <span style={styles.discount}>{product.discount}% off</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;