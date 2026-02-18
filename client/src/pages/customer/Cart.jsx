import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    pincode: '',
    paymentMethod: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  
  const navigate = useNavigate();
  const { refreshCartCount } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');
  const API_BASE = 'http://localhost:6001';

  useEffect(() => {
    if (!userId) {
      navigate('/auth');
      return;
    }
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      // Fix: Use the correct endpoint with userId
      const response = await axios.get(`${API_BASE}/fetch-cart/${userId}`);
      if (response.data.success) {
        setCartItems(response.data.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If endpoint doesn't exist, try the old one
      try {
        const fallbackResponse = await axios.get(`${API_BASE}/fetch-cart`);
        if (fallbackResponse.data) {
          // Filter on client side
          const userItems = fallbackResponse.data.filter(item => item.userId === userId);
          setCartItems(userItems);
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = cartItems.reduce((sum, item) => 
      sum + ((item.price * (item.discount || 0) / 100) * item.quantity), 0
    );
    
    setTotalPrice(total);
    setTotalDiscount(Math.floor(discount));
    setDeliveryCharges(total > 1000 || cartItems.length === 0 ? 0 : 50);
  };

  const updateQuantity = async (itemId, action) => {
    try {
      const item = cartItems.find(i => i._id === itemId);
      if (!item) return;

      if (action === 'increase') {
        await axios.put(`${API_BASE}/increase-cart-quantity`, { id: itemId });
      } else if (action === 'decrease') {
        if (item.quantity === 1) {
          await removeItem(itemId);
          return;
        }
        await axios.put(`${API_BASE}/decrease-cart-quantity`, { id: itemId });
      }
      
      await fetchCart();
      if (refreshCartCount) await refreshCartCount();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Remove this item from cart?')) return;
    
    try {
      await axios.delete(`${API_BASE}/remove-cart-item/${itemId}`);
      await fetchCart();
      if (refreshCartCount) await refreshCartCount();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const handleInputChange = (e) => {
    setCheckoutData({
      ...checkoutData,
      [e.target.name]: e.target.value
    });
  };

  const placeOrder = async () => {
    // Validation
    const { name, mobile, email, address, pincode, paymentMethod } = checkoutData;
    
    if (!name || !mobile || !email || !address || !pincode || !paymentMethod) {
      alert('Please fill all fields');
      return;
    }
    
    if (!/^\d{10}$/.test(mobile)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!/^\d{6}$/.test(pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }
    
    try {
      const response = await axios.post(`${API_BASE}/place-cart-order`, {
        userId,
        ...checkoutData,
        orderDate: new Date()
      });
      
      if (response.data.success) {
        alert('Order placed successfully!');
        setCartItems([]);
        if (refreshCartCount) await refreshCartCount();
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const finalPrice = totalPrice - totalDiscount + deliveryCharges;

  // Helper function to format price
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Helper function to get discounted price per item
  const getItemPrice = (item) => {
    const price = item.price;
    const discount = item.discount || 0;
    if (discount === 0) return price;
    return price * (100 - discount) / 100;
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '30px'
    },
    cartSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333'
    },
    cartItem: {
      display: 'flex',
      gap: '20px',
      padding: '20px 0',
      borderBottom: '1px solid #eee'
    },
    itemImage: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '4px'
    },
    itemDetails: {
      flex: 1
    },
    itemTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '5px',
      color: '#333'
    },
    itemDescription: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px'
    },
    itemMeta: {
      display: 'flex',
      gap: '20px',
      marginBottom: '10px'
    },
    metaText: {
      fontSize: '14px',
      color: '#666'
    },
    itemPrice: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '10px'
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    quantityBtn: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      border: '1px solid #ddd',
      backgroundColor: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    quantity: {
      fontSize: '16px',
      fontWeight: '600'
    },
    removeBtn: {
      padding: '5px 15px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      marginLeft: '20px'
    },
    summarySection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: '100px'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '15px',
      fontSize: '16px'
    },
    summaryTotal: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#667eea',
      marginTop: '15px',
      paddingTop: '15px',
      borderTop: '2px solid #eee'
    },
    checkoutBtn: {
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
    emptyCart: {
      textAlign: 'center',
      padding: '50px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      gridColumn: 'span 2'
    },
    emptyCartIcon: {
      fontSize: '60px',
      marginBottom: '20px',
      color: '#ccc'
    },
    emptyCartText: {
      fontSize: '18px',
      color: '#666',
      marginBottom: '20px'
    },
    shopNowBtn: {
      padding: '12px 30px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer'
    },
    loading: {
      textAlign: 'center',
      padding: '50px'
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyCart}>
          <div style={styles.emptyCartIcon}>🛒</div>
          <h3 style={styles.emptyCartText}>Your cart is empty</h3>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <button style={styles.shopNowBtn} onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Cart Items */}
      <div style={styles.cartSection}>
        <h2 style={styles.title}>Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h2>
        
        {cartItems.map(item => {
          const itemDiscountedPrice = getItemPrice(item);
          const itemTotal = itemDiscountedPrice * item.quantity;
          
          return (
            <div key={item._id} style={styles.cartItem}>
              <img 
                src={item.mainImg} 
                alt={item.title}
                style={styles.itemImage}
                onError={(e) => {
                  e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=400';
                }}
              />
              <div style={styles.itemDetails}>
                <h3 style={styles.itemTitle}>{item.title}</h3>
                <p style={styles.itemDescription}>{item.description}</p>
                
                <div style={styles.itemMeta}>
                  {item.size && (
                    <span style={styles.metaText}>
                      <strong>Size:</strong> {item.size}
                    </span>
                  )}
                  <span style={styles.metaText}>
                    <strong>Price:</strong> ${itemDiscountedPrice.toFixed(2)}
                  </span>
                  {item.discount > 0 && (
                    <span style={{ ...styles.metaText, color: '#28a745' }}>
                      {item.discount}% off
                    </span>
                  )}
                </div>

                <div style={styles.itemPrice}>
                  Total: ${itemTotal.toFixed(2)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={styles.quantityControls}>
                    <button 
                      style={styles.quantityBtn}
                      onClick={() => updateQuantity(item._id, 'decrease')}
                    >
                      -
                    </button>
                    <span style={styles.quantity}>{item.quantity}</span>
                    <button 
                      style={styles.quantityBtn}
                      onClick={() => updateQuantity(item._id, 'increase')}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    style={styles.removeBtn}
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div style={styles.summarySection}>
        <h2 style={styles.title}>Order Summary</h2>
        
        <div style={styles.summaryRow}>
          <span>Total MRP:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        
        <div style={styles.summaryRow}>
          <span>Discount:</span>
          <span style={{ color: '#28a745' }}>- ${totalDiscount.toFixed(2)}</span>
        </div>
        
        <div style={styles.summaryRow}>
          <span>Delivery Charges:</span>
          <span style={{ color: deliveryCharges > 0 ? '#ff6b6b' : '#28a745' }}>
            {deliveryCharges > 0 ? `+ $${deliveryCharges}` : 'Free'}
          </span>
        </div>
        
        <div style={styles.summaryTotal}>
          <span>Total Amount:</span>
          <span>${finalPrice.toFixed(2)}</span>
        </div>

        <button 
          style={styles.checkoutBtn}
          data-bs-toggle="modal"
          data-bs-target="#checkoutModal"
        >
          Proceed to Checkout
        </button>
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
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Full Name *"
                  value={checkoutData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
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

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email *"
                  value={checkoutData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <textarea
                  name="address"
                  className="form-control"
                  rows="3"
                  placeholder="Full Address *"
                  value={checkoutData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
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

              <div className="mb-3">
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
                onClick={placeOrder}
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

export default Cart;