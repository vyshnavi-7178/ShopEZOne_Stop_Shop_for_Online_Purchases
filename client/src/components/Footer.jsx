import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '40px 0 20px',
      marginTop: '50px'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    topSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '30px',
      marginBottom: '30px'
    },
    column: {
      display: 'flex',
      flexDirection: 'column'
    },
    columnTitle: {
      color: '#667eea',
      marginBottom: '15px',
      fontSize: '18px'
    },
    link: {
      color: '#ecf0f1',
      textDecoration: 'none',
      marginBottom: '10px',
      fontSize: '14px',
      transition: 'color 0.3s',
      cursor: 'pointer'
    },
    bottomSection: {
      borderTop: '1px solid #34495e',
      paddingTop: '20px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#bdc3c7'
    },
    socialIcons: {
      display: 'flex',
      gap: '15px',
      marginTop: '15px'
    },
    icon: {
      fontSize: '20px',
      cursor: 'pointer',
      color: '#bdc3c7',
      transition: 'color 0.3s'
    }
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.topSection}>
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>ShopEZ</h4>
            <p style={{ color: '#bdc3c7', fontSize: '14px', lineHeight: '1.6' }}>
              Your one-stop destination for all your needs. Quality products, best prices, and fast delivery.
            </p>
          </div>

          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Quick Links</h4>
            <span style={styles.link} onClick={() => handleNavigation('/')}>Home</span>
            <span style={styles.link} onClick={() => handleNavigation('/all-products')}>All Products</span>
            <span style={styles.link} onClick={() => handleNavigation('/cart')}>Cart</span>
            <span style={styles.link} onClick={() => handleNavigation('/profile')}>Profile</span>
          </div>

          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Categories</h4>
            <span style={styles.link} onClick={() => handleNavigation('/category/electronics')}>Electronics</span>
            <span style={styles.link} onClick={() => handleNavigation('/category/fashion')}>Fashion</span>
            <span style={styles.link} onClick={() => handleNavigation('/category/shoes')}>Shoes</span>
            <span style={styles.link} onClick={() => handleNavigation('/category/sports')}>Sports</span>
          </div>

          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Contact Us</h4>
            <p style={{ color: '#bdc3c7', fontSize: '14px', marginBottom: '5px' }}>
              📧 support@shopEZ.com
            </p>
            <p style={{ color: '#bdc3c7', fontSize: '14px', marginBottom: '5px' }}>
              📞 +1 234 567 890
            </p>
            <p style={{ color: '#bdc3c7', fontSize: '14px' }}>
              🏢 123 ShopEZ Street, NY 10001
            </p>
          </div>
        </div>

        <div style={styles.bottomSection}>
          <p>© 2025 ShopEZ.com - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;