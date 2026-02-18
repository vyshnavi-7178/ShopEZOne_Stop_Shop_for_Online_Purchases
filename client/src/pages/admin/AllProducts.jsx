import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [sortBy, setSortBy] = useState('');

  const API_BASE = 'http://localhost:6001';

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/auth');
      return;
    }
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedGender, sortBy]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE}/fetch-products`),
        axios.get(`${API_BASE}/fetch-categories`)
      ]);
      
      if (productsRes.data.success) {
        setProducts(productsRes.data.data);
        setFilteredProducts(productsRes.data.data);
      }
      
      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply gender filter
    if (selectedGender) {
      filtered = filtered.filter(p => p.gender === selectedGender);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await axios.delete(`${API_BASE}/delete-product/${productId}`);
      if (response.data.success) {
        alert('Product deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  // Format price
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gap: '15px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333'
    },
    addBtn: {
      padding: '10px 20px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    filters: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    searchInput: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      width: '100%'
    },
    select: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white',
      width: '100%'
    },
    // Products Grid - 3 in a row
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginTop: '20px'
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, boxShadow 0.3s'
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
    productCategory: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px'
    },
    productBrand: {
      fontSize: '14px',
      color: '#667eea',
      marginBottom: '10px',
      fontWeight: '500'
    },
    productPrice: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '15px'
    },
    actionButtons: {
      display: 'flex',
      gap: '10px'
    },
    updateBtn: {
      flex: 1,
      padding: '8px',
      backgroundColor: '#ffc107',
      color: '#333',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    deleteBtn: {
      flex: 1,
      padding: '8px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    loading: {
      textAlign: 'center',
      padding: '50px'
    },
    noProducts: {
      textAlign: 'center',
      padding: '50px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      gridColumn: 'span 3'
    },
    // Responsive
    '@media (max-width: 768px)': {
      productsGrid: {
        gridTemplateColumns: 'repeat(2, 1fr)'
      }
    },
    '@media (max-width: 480px)': {
      productsGrid: {
        gridTemplateColumns: '1fr'
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>All Products ({filteredProducts.length})</h1>
        <button 
          style={styles.addBtn}
          onClick={() => navigate('/new-product')}
        >
          + Add New Product
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          style={styles.select}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          style={styles.select}
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>

        <select
          style={styles.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="discount">Discount</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Products Grid - 3 in a row */}
      {filteredProducts.length === 0 ? (
        <div style={styles.noProducts}>
          <p>No products found</p>
        </div>
      ) : (
        <div style={styles.productsGrid}>
          {filteredProducts.map(product => (
            <div 
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
              <img 
                src={product.mainImg} 
                alt={product.title}
                style={styles.productImage}
                onError={(e) => {
                  e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=400';
                }}
              />
              <div style={styles.productInfo}>
                <h3 style={styles.productTitle}>{product.title}</h3>
                <p style={styles.productCategory}>
                  {product.category}
                </p>
                {product.brand && (
                  <p style={styles.productBrand}>• {product.brand}</p>
                )}
                <div style={styles.productPrice}>
                  {formatPrice(product.price)}
                  {product.discount > 0 && (
                    <span style={{ fontSize: '14px', color: '#28a745', marginLeft: '10px' }}>
                      {product.discount}% off
                    </span>
                  )}
                </div>
                <div style={styles.actionButtons}>
                  <button 
                    style={styles.updateBtn}
                    onClick={() => navigate(`/update-product/${product._id}`)}
                  >
                    Update
                  </button>
                  <button 
                    style={styles.deleteBtn}
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;