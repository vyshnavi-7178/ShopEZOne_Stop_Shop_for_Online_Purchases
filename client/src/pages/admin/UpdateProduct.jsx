import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productMainImg: '',
    productCarousel: ['', '', ''],
    productSizes: [],
    productGender: '',
    productCategory: '',
    productNewCategory: '',
    productPrice: '',
    productDiscount: '',
    productBrand: '',
    productRating: '4.5',
    productStock: '10'
  });

  const API_BASE = 'http://localhost:6001';

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [productRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE}/fetch-product-details/${id}`),
        axios.get(`${API_BASE}/fetch-categories`)
      ]);
      
      if (productRes.data.success) {
        const product = productRes.data.data;
        setFormData({
          productName: product.title || '',
          productDescription: product.description || '',
          productMainImg: product.mainImg || '',
          productCarousel: product.carousel || ['', '', ''],
          productSizes: product.sizes || [],
          productGender: product.gender || '',
          productCategory: product.category || '',
          productNewCategory: '',
          productPrice: product.price || '',
          productDiscount: product.discount || '',
          productBrand: product.brand || '',
          productRating: product.rating || '4.5',
          productStock: product.countInStock || '10'
        });
      }
      
      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load product');
      navigate('/all-products');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCarouselChange = (index, value) => {
    const newCarousel = [...formData.productCarousel];
    newCarousel[index] = value;
    setFormData(prev => ({
      ...prev,
      productCarousel: newCarousel
    }));
  };

  const handleSizeChange = (size) => {
    setFormData(prev => {
      const sizes = prev.productSizes.includes(size)
        ? prev.productSizes.filter(s => s !== size)
        : [...prev.productSizes, size];
      return { ...prev, productSizes: sizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.productName || !formData.productDescription || !formData.productMainImg || !formData.productPrice) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${API_BASE}/update-product/${id}`, formData);
      if (response.data.success) {
        alert('Product updated successfully!');
        navigate('/all-products');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '40px auto',
      padding: '0 20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#333'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      minHeight: '100px'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px'
    },
    carouselRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '10px',
      marginBottom: '20px'
    },
    section: {
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#333'
    },
    sizeOptions: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap'
    },
    sizeCheckbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    genderOptions: {
      display: 'flex',
      gap: '20px'
    },
    genderRadio: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    submitBtn: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '20px'
    },
    cancelBtn: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      color: '#333',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px'
    },
    loading: {
      textAlign: 'center',
      padding: '50px'
    }
  };

  if (fetching) {
    return (
      <div style={styles.loading}>
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Update Product</h1>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name *</label>
            <input
              type="text"
              name="productName"
              style={styles.input}
              value={formData.productName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="productDescription"
              style={styles.textarea}
              value={formData.productDescription}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Images */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Images</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Main Image URL *</label>
              <input
                type="text"
                name="productMainImg"
                style={styles.input}
                value={formData.productMainImg}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={styles.carouselRow}>
              {[0, 1, 2].map(index => (
                <div key={index}>
                  <label style={styles.label}>Image {index + 1}</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.productCarousel[index]}
                    onChange={(e) => handleCarouselChange(index, e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Pricing</h3>
            
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Price ($) *</label>
                <input
                  type="number"
                  name="productPrice"
                  style={styles.input}
                  value={formData.productPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Discount (%)</label>
                <input
                  type="number"
                  name="productDiscount"
                  style={styles.input}
                  value={formData.productDiscount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Stock</label>
                <input
                  type="number"
                  name="productStock"
                  style={styles.input}
                  value={formData.productStock}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Category</h3>
            
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  name="productCategory"
                  style={styles.select}
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="new category">+ Add New Category</option>
                </select>
              </div>

              {formData.productCategory === 'new category' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>New Category Name *</label>
                  <input
                    type="text"
                    name="productNewCategory"
                    style={styles.input}
                    value={formData.productNewCategory}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Brand</label>
                <input
                  type="text"
                  name="productBrand"
                  style={styles.input}
                  value={formData.productBrand}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Available Sizes</h3>
            <div style={styles.sizeOptions}>
              {['S', 'M', 'L', 'XL', 'XXL', '7', '8', '9', '10', '11', '12'].map(size => (
                <label key={size} style={styles.sizeCheckbox}>
                  <input
                    type="checkbox"
                    checked={formData.productSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Gender</h3>
            <div style={styles.genderOptions}>
              {['men', 'women', 'unisex'].map(gender => (
                <label key={gender} style={styles.genderRadio}>
                  <input
                    type="radio"
                    name="productGender"
                    value={gender}
                    checked={formData.productGender === gender}
                    onChange={handleInputChange}
                  />
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Rating (1-5)</label>
            <input
              type="number"
              name="productRating"
              style={styles.input}
              value={formData.productRating}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <button 
            type="submit" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>

          <button 
            type="button" 
            style={styles.cancelBtn}
            onClick={() => navigate('/all-products')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;