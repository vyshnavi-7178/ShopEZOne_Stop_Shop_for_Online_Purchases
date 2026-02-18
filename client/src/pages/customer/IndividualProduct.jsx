import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';

const IndividualProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // Checkout state
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    pincode: '',
    paymentMethod: ''
  });

  const userId = localStorage.getItem('userId');
  const API_BASE = 'http://localhost:6001';

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/fetch-product-details/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      navigate('/auth');
      return;
    }

    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/add-to-cart`, {
        userId,
        title: product.title,
        description: product.description,
        mainImg: product.mainImg,
        size: selectedSize,
        quantity,
        price: product.price,
        discount: product.discount || 0
      });

      if (response.data.success) {
        alert('Product added to cart!');
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!userId) {
      navigate('/auth');
      return;
    }

    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    // Validate checkout data
    const { name, mobile, email, address, pincode, paymentMethod } = checkoutData;
    
    if (!name || !mobile || !email || !address || !pincode || !paymentMethod) {
      alert('Please fill all checkout fields');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/buy-product`, {
        userId,
        ...checkoutData,
        title: product.title,
        description: product.description,
        mainImg: product.mainImg,
        size: selectedSize,
        quantity,
        price: product.price,
        discount: product.discount || 0,
        orderDate: new Date()
      });

      if (response.data.success) {
        alert('Order placed successfully!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const handleInputChange = (e) => {
    setCheckoutData({
      ...checkoutData,
      [e.target.name]: e.target.value
    });
  };

  // Calculate discounted price
  const getDiscountedPrice = () => {
    if (!product) return '0.00';
    if (!product.discount || product.discount === 0) return product.price?.toFixed(2) || '0.00';
    return (product.price * (100 - product.discount) / 100).toFixed(2);
  };

  // Safely access carousel images
  const getCarouselImage = (index) => {
    if (!product?.carousel || !Array.isArray(product.carousel)) return product?.mainImg || '';
    return product.carousel[index] || product.mainImg || '';
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px'
    },
    backBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      marginBottom: '20px',
      cursor: 'pointer',
      color: '#667eea',
      fontSize: '16px'
    },
    productContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    carousel: {
      width: '100%'
    },
    carouselImage: {
      width: '100%',
      height: '400px',
      objectFit: 'cover',
      borderRadius: '8px'
    },
    productInfo: {
      padding: '20px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333'
    },
    description: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '20px',
      lineHeight: '1.6'
    },
    priceSection: {
      marginBottom: '20px'
    },
    currentPrice: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#667eea'
    },
    originalPrice: {
      fontSize: '20px',
      color: '#999',
      textDecoration: 'line-through',
      marginLeft: '15px'
    },
    discount: {
      fontSize: '18px',
      color: '#28a745',
      marginLeft: '15px'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px'
    },
    stars: {
      color: '#ffc107',
      fontSize: '18px'
    },
    ratingValue: {
      fontSize: '16px',
      color: '#666'
    },
    brand: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '20px'
    },
    sizeSection: {
      marginBottom: '20px'
    },
    sizeLabel: {
      display: 'block',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#333'
    },
    sizeOptions: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    sizeBtn: {
      padding: '10px 20px',
      border: '2px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    selectedSize: {
      borderColor: '#667eea',
      backgroundColor: '#667eea',
      color: 'white'
    },
    quantitySection: {
      marginBottom: '20px'
    },
    quantityLabel: {
      display: 'block',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#333'
    },
    quantitySelect: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      width: '80px'
    },
    deliveryInfo: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '30px'
    },
    deliveryText: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px'
    },
    actionButtons: {
      display: 'flex',
      gap: '15px'
    },
    buyNowBtn: {
      flex: 1,
      padding: '15px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    addToCartBtn: {
      flex: 1,
      padding: '15px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    loading: {
      textAlign: 'center',
      padding: '50px'
    },
    error: {
      textAlign: 'center',
      padding: '50px',
      color: '#ff6b6b'
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.error}>
        <h3>Error</h3>
        <p>{error || 'Product not found'}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  const discountedPrice = getDiscountedPrice();

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <div style={styles.backBtn} onClick={() => navigate(-1)}>
        <HiOutlineArrowSmLeft /> Back
      </div>

      {/* Product Details */}
      <div style={styles.productContainer}>
        {/* Image Carousel */}
        <div style={styles.carousel}>
          <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="0" className="active"></button>
              {product.carousel && Array.isArray(product.carousel) && product.carousel.map((_, index) => (
                index > 0 && (
                  <button key={index} type="button" data-bs-target="#productCarousel" data-bs-slide-to={index}></button>
                )
              ))}
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img 
                  src={product.mainImg} 
                  className="d-block w-100" 
                  style={styles.carouselImage} 
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=400';
                  }}
                />
              </div>
              {product.carousel && Array.isArray(product.carousel) && product.carousel.map((img, index) => (
                img && (
                  <div className="carousel-item" key={index}>
                    <img 
                      src={img} 
                      className="d-block w-100" 
                      style={styles.carouselImage} 
                      alt={`${product.title} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = product.mainImg;
                      }}
                    />
                  </div>
                )
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div style={styles.productInfo}>
          <h1 style={styles.title}>{product.title}</h1>
          
          {product.brand && (
            <p style={styles.brand}>Brand: {product.brand}</p>
          )}

          <div style={styles.rating}>
            <span style={styles.stars}>
              {'★'.repeat(Math.floor(product.rating || 4.5))}
              {'☆'.repeat(5 - Math.floor(product.rating || 4.5))}
            </span>
            <span style={styles.ratingValue}>({product.rating || 4.5})</span>
          </div>

          <div style={styles.priceSection}>
            <span style={styles.currentPrice}>${discountedPrice}</span>
            {product.discount > 0 && (
              <>
                <span style={styles.originalPrice}>${product.price?.toFixed(2)}</span>
                <span style={styles.discount}>{product.discount}% off</span>
              </>
            )}
          </div>

          <p style={styles.description}>{product.description}</p>

          {/* Size Selection */}
          {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div style={styles.sizeSection}>
              <label style={styles.sizeLabel}>Select Size:</label>
              <div style={styles.sizeOptions}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    style={{
                      ...styles.sizeBtn,
                      ...(selectedSize === size ? styles.selectedSize : {})
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={styles.quantitySection}>
            <label style={styles.quantityLabel}>Quantity:</label>
            <select
              style={styles.quantitySelect}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* Delivery Info */}
          <div style={styles.deliveryInfo}>
            <p style={styles.deliveryText}>✅ Free delivery in 5-7 business days</p>
            <p style={styles.deliveryText}>💰 Cash on delivery available</p>
            <p style={styles.deliveryText}>↩️ 7-day return policy</p>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              style={styles.buyNowBtn}
              data-bs-toggle="modal"
              data-bs-target="#checkoutModal"
            >
              Buy Now
            </button>
            <button
              style={styles.addToCartBtn}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <div className="modal fade" id="checkoutModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Checkout</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Full Name *"
                  value={checkoutData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="tel"
                  name="mobile"
                  className="form-control"
                  placeholder="Mobile Number *"
                  value={checkoutData.mobile}
                  onChange={handleInputChange}
                  maxLength="10"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email *"
                  value={checkoutData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <textarea
                  name="address"
                  className="form-control"
                  rows="3"
                  placeholder="Full Address *"
                  value={checkoutData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  placeholder="Pincode *"
                  value={checkoutData.pincode}
                  onChange={handleInputChange}
                  maxLength="6"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <select
                  name="paymentMethod"
                  className="form-control"
                  value={checkoutData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="">Select Payment Method *</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleBuyNow}
                data-bs-dismiss="modal"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualProduct;