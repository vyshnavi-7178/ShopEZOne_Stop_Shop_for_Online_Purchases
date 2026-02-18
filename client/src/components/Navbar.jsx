import React, { useContext, useEffect, useState } from 'react';
import { BsCart3, BsPersonCircle } from 'react-icons/bs';
import { FcSearch } from 'react-icons/fc';
import { ImCancelCircle } from 'react-icons/im';
import { Link, useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import { getCategoryIcon } from '../utils/productUtils';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount, logout } = useContext(GeneralContext);
  
  const userType = localStorage.getItem('userType');
  const username = localStorage.getItem('username');
  
  const [productSearch, setProductSearch] = useState('');
  const [noResult, setNoResult] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:6001';

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/fetch-categories-with-counts`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async () => {
    if (!productSearch.trim()) {
      setNoResult(true);
      return;
    }

    setLoading(true);
    try {
      // First check if it's a category
      const matchingCategory = categories.find(cat => 
        cat.name.toLowerCase() === productSearch.toLowerCase()
      );

      if (matchingCategory) {
        navigate(`/category/${matchingCategory.name.toLowerCase()}`);
        setNoResult(false);
      } else {
        // Search products
        const response = await axios.get(`${API_BASE}/search-products?q=${productSearch}`);
        if (response.data.success && response.data.data.length > 0) {
          navigate('/search-results', { 
            state: { 
              products: response.data.data, 
              query: productSearch 
            } 
          });
          setNoResult(false);
        } else {
          setNoResult(true);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setNoResult(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Styles
  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 30px',
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    adminNavbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 30px',
      backgroundColor: '#2c3e50',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    logo: {
      cursor: 'pointer',
      color: '#667eea',
      margin: 0,
      fontSize: '24px',
      fontWeight: 'bold'
    },
    adminLogo: {
      cursor: 'pointer',
      color: 'white',
      margin: 0,
      fontSize: '24px',
      fontWeight: 'bold'
    },
    searchContainer: {
      position: 'relative',
      flex: 1,
      maxWidth: '500px',
      margin: '0 20px'
    },
    searchInput: {
      width: '100%',
      padding: '10px 40px 10px 15px',
      border: '1px solid #ddd',
      borderRadius: '25px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    searchIcon: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '20px',
      cursor: 'pointer'
    },
    categoriesContainer: {
      marginRight: '15px',
      position: 'relative'
    },
    dropdown: {
      position: 'relative',
      display: 'inline-block'
    },
    dropdownBtn: {
      background: 'transparent',
      color: '#333',
      border: '1px solid #ddd',
      padding: '8px 16px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s',
      fontFamily: 'inherit'
    },
    dropdownContent: {
      display: 'none',
      position: 'absolute',
      backgroundColor: 'white',
      minWidth: '220px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      zIndex: 1000,
      maxHeight: '400px',
      overflowY: 'auto',
      top: '100%',
      marginTop: '5px'
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 16px',
      textDecoration: 'none',
      color: '#333',
      transition: 'background 0.2s',
      borderBottom: '1px solid #f0f0f0'
    },
    categoryIcon: {
      fontSize: '20px',
      marginRight: '12px',
      width: '24px',
      textAlign: 'center'
    },
    categoryName: {
      flex: 1,
      textTransform: 'capitalize'
    },
    categoryCount: {
      color: '#666',
      fontSize: '12px',
      marginLeft: '8px'
    },
    loginBtn: {
      background: '#667eea',
      color: 'white',
      border: 'none',
      padding: '8px 24px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '14px',
      transition: 'background 0.3s'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    profileIcon: {
      fontSize: '24px',
      color: '#667eea',
      cursor: 'pointer'
    },
    cartIcon: {
      position: 'relative',
      cursor: 'pointer'
    },
    cartBadge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      borderRadius: '50%',
      width: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    adminMenu: {
      display: 'flex',
      gap: '20px',
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    adminMenuItem: {
      cursor: 'pointer',
      color: 'white'
    },
    logoutItem: {
      cursor: 'pointer',
      color: '#ff6b6b'
    },
    noResult: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      border: '1px solid #ff6b6b',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '5px',
      color: '#ff6b6b',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1001
    }
  };

  // Guest Navbar
  if (!userType) {
    return (
      <div style={styles.navbar}>
        <h3 style={styles.logo} onClick={() => navigate('/')}>
          ShopEZ
        </h3>

        <div style={styles.searchContainer}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search products, categories..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <FcSearch
            style={styles.searchIcon}
            onClick={handleSearch}
          />
          {noResult && (
            <div style={styles.noResult}>
              <span>❌ No items found... Try different keywords</span>
              <ImCancelCircle
                style={{ cursor: 'pointer', fontSize: '18px' }}
                onClick={() => setNoResult(false)}
              />
            </div>
          )}
        </div>

        {/* Categories Dropdown */}
        <div 
          style={styles.categoriesContainer}
          onMouseEnter={(e) => {
            const content = e.currentTarget.querySelector('.dropdown-content');
            if (content) content.style.display = 'block';
          }}
          onMouseLeave={(e) => {
            const content = e.currentTarget.querySelector('.dropdown-content');
            if (content) content.style.display = 'none';
          }}
        >
          <div style={styles.dropdown}>
            <button style={styles.dropdownBtn}>
              Categories ▼
            </button>
            <div className="dropdown-content" style={styles.dropdownContent}>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/category/${category.name.toLowerCase()}`}
                    style={styles.dropdownItem}
                    onClick={() => setNoResult(false)}
                  >
                    <span style={styles.categoryIcon}>
                      {getCategoryIcon(category.name)}
                    </span>
                    <span style={styles.categoryName}>{category.name}</span>
                    <span style={styles.categoryCount}>({category.count})</span>
                  </Link>
                ))
              ) : (
                <div style={{ padding: '12px', color: '#666' }}>Loading categories...</div>
              )}
            </div>
          </div>
        </div>

        <button
          style={styles.loginBtn}
          onClick={() => navigate('/auth')}
        >
          Login
        </button>
      </div>
    );
  }

  // Customer Navbar
  if (userType === 'customer') {
    return (
      <div style={styles.navbar}>
        <h3 style={styles.logo} onClick={() => navigate('/')}>
          ShopEZ
        </h3>

        <div style={styles.searchContainer}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search products, categories..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <FcSearch
            style={styles.searchIcon}
            onClick={handleSearch}
          />
          {noResult && (
            <div style={styles.noResult}>
              <span>❌ No items found... Try different keywords</span>
              <ImCancelCircle
                style={{ cursor: 'pointer', fontSize: '18px' }}
                onClick={() => setNoResult(false)}
              />
            </div>
          )}
        </div>

        {/* Categories Dropdown */}
        <div 
          style={styles.categoriesContainer}
          onMouseEnter={(e) => {
            const content = e.currentTarget.querySelector('.dropdown-content');
            if (content) content.style.display = 'block';
          }}
          onMouseLeave={(e) => {
            const content = e.currentTarget.querySelector('.dropdown-content');
            if (content) content.style.display = 'none';
          }}
        >
          <div style={styles.dropdown}>
            <button style={styles.dropdownBtn}>
              Categories ▼
            </button>
            <div className="dropdown-content" style={styles.dropdownContent}>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/category/${category.name.toLowerCase()}`}
                    style={styles.dropdownItem}
                    onClick={() => setNoResult(false)}
                  >
                    <span style={styles.categoryIcon}>
                      {getCategoryIcon(category.name)}
                    </span>
                    <span style={styles.categoryName}>{category.name}</span>
                    <span style={styles.categoryCount}>({category.count})</span>
                  </Link>
                ))
              ) : (
                <div style={{ padding: '12px', color: '#666' }}>Loading categories...</div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.userInfo}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          >
            <BsPersonCircle style={styles.profileIcon} />
            <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>{username}</p>
          </div>

          <div style={styles.cartIcon} onClick={() => navigate('/cart')}>
            <BsCart3 style={styles.profileIcon} />
            {cartCount > 0 && (
              <div style={styles.cartBadge}>
                {cartCount}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin Navbar
  return (
    <div style={styles.adminNavbar}>
      <h3 style={styles.adminLogo} onClick={() => navigate('/admin')}>
        ShopEZ (Admin)
      </h3>

      <ul style={styles.adminMenu}>
        <li style={styles.adminMenuItem} onClick={() => navigate('/admin')}>
          Dashboard
        </li>
        <li style={styles.adminMenuItem} onClick={() => navigate('/all-users')}>
          Users
        </li>
        <li style={styles.adminMenuItem} onClick={() => navigate('/all-orders')}>
          Orders
        </li>
        <li style={styles.adminMenuItem} onClick={() => navigate('/all-products')}>
          Products
        </li>
        <li style={styles.adminMenuItem} onClick={() => navigate('/new-product')}>
          + Add Product
        </li>
        <li style={styles.logoutItem} onClick={logout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Navbar;