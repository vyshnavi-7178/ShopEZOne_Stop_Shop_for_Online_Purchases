import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';
import { getDiscountedPrice } from '../../utils/productUtils';

const Profile = () => {
  const { logout } = useContext(GeneralContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const API_BASE = 'http://localhost:6001';

  useEffect(() => {
    if (!userId) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/fetch-orders/${userId}`);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const response = await axios.put(`${API_BASE}/cancel-order/${orderId}`);
      if (response.data.success) {
        alert('Order cancelled successfully');
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      case 'in-transit': return '#ffc107';
      case 'processing': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px'
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      borderBottom: '2px solid #eee',
      paddingBottom: '10px'
    },
    tab: {
      padding: '10px 20px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#666',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      position: 'relative'
    },
    activeTab: {
      color: '#667eea'
    },
    activeTabIndicator: {
      position: 'absolute',
      bottom: '-12px',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#667eea'
    },
    profileCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    },
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '30px'
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#667eea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white'
    },
    profileInfo: {
      flex: 1
    },
    profileName: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#333'
    },
    profileEmail: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '10px'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center'
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '5px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#666'
    },
    logoutBtn: {
      padding: '12px 30px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer'
    },
    ordersSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    ordersTitle: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333'
    },
    orderCard: {
      border: '1px solid #eee',
      borderRadius: '8px',
      marginBottom: '20px',
      overflow: 'hidden'
    },
    orderHeader: {
      backgroundColor: '#f8f9fa',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #eee'
    },
    orderId: {
      fontSize: '14px',
      color: '#666'
    },
    orderDate: {
      fontSize: '14px',
      color: '#666'
    },
    orderStatus: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white'
    },
    orderBody: {
      padding: '20px',
      display: 'flex',
      gap: '20px'
    },
    orderImage: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '4px'
    },
    orderDetails: {
      flex: 1
    },
    orderTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#333'
    },
    orderDescription: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '15px'
    },
    orderMeta: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      marginBottom: '15px'
    },
    metaItem: {
      fontSize: '14px',
      color: '#666'
    },
    orderPrice: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#667eea'
    },
    cancelBtn: {
      padding: '8px 20px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer'
    },
    noOrders: {
      textAlign: 'center',
      padding: '50px',
      color: '#666'
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
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'profile' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('profile')}
        >
          Profile
          {activeTab === 'profile' && <span style={styles.activeTabIndicator}></span>}
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'orders' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('orders')}
        >
          My Orders ({orders.length})
          {activeTab === 'orders' && <span style={styles.activeTabIndicator}></span>}
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>
              {username?.charAt(0).toUpperCase()}
            </div>
            <div style={styles.profileInfo}>
              <h2 style={styles.profileName}>{username}</h2>
              <p style={styles.profileEmail}>{email}</p>
            </div>
          </div>

          <div style={styles.stats}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{orders.length}</div>
              <div style={styles.statLabel}>Total Orders</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                {orders.filter(o => o.orderStatus === 'delivered').length}
              </div>
              <div style={styles.statLabel}>Delivered</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                {orders.filter(o => o.orderStatus === 'cancelled').length}
              </div>
              <div style={styles.statLabel}>Cancelled</div>
            </div>
          </div>

          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={styles.ordersSection}>
          <h2 style={styles.ordersTitle}>My Orders</h2>
          
          {orders.length === 0 ? (
            <div style={styles.noOrders}>
              <p>You haven't placed any orders yet.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <span style={styles.orderId}>
                    Order #{order._id.slice(-8)}
                  </span>
                  <span style={styles.orderDate}>
                    {formatDate(order.orderDate)}
                  </span>
                  <span style={{
                    ...styles.orderStatus,
                    backgroundColor: getStatusColor(order.orderStatus)
                  }}>
                    {order.orderStatus}
                  </span>
                </div>
                
                <div style={styles.orderBody}>
                  <img 
                    src={order.mainImg} 
                    alt={order.title}
                    style={styles.orderImage}
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=400';
                    }}
                  />
                  
                  <div style={styles.orderDetails}>
                    <h3 style={styles.orderTitle}>{order.title}</h3>
                    <p style={styles.orderDescription}>{order.description}</p>
                    
                    <div style={styles.orderMeta}>
                      {order.size && (
                        <div style={styles.metaItem}>
                          <strong>Size:</strong> {order.size}
                        </div>
                      )}
                      <div style={styles.metaItem}>
                        <strong>Quantity:</strong> {order.quantity}
                      </div>
                      <div style={styles.metaItem}>
                        <strong>Payment:</strong> {order.paymentMethod}
                      </div>
                      {order.deliveryDate && (
                        <div style={styles.metaItem}>
                          <strong>Delivered:</strong> {formatDate(order.deliveryDate)}
                        </div>
                      )}
                    </div>
                    
                    <div style={styles.orderPrice}>
                      Total: ${(getDiscountedPrice(order.price, order.discount) * order.quantity).toFixed(2)}
                    </div>
                    
                    {order.orderStatus !== 'delivered' && 
                     order.orderStatus !== 'cancelled' && (
                      <button 
                        style={styles.cancelBtn}
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;