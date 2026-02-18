import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getDiscountedPrice } from '../../utils/productUtils';

const AllOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE = 'http://localhost:6001';

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE}/fetch-all-orders`);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE}/update-order-status/${orderId}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        alert(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;

    try {
      const response = await axios.put(`${API_BASE}/cancel-order/${orderId}`);
      if (response.data.success) {
        alert('Order cancelled');
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
    const matchesSearch = !searchTerm || 
      order.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.includes(searchTerm);
    
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
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
    header: {
      marginBottom: '30px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333'
    },
    filters: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px'
    },
    searchInput: {
      flex: 1,
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    statusSelect: {
      width: '200px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white'
    },
    ordersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    orderCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
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
      color: '#666',
      fontWeight: '600'
    },
    orderDate: {
      fontSize: '14px',
      color: '#666'
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white'
    },
    orderBody: {
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: '100px 1fr',
      gap: '20px'
    },
    orderImage: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '4px'
    },
    orderDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    productInfo: {
      borderBottom: '1px solid #eee',
      paddingBottom: '15px'
    },
    productTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '5px',
      color: '#333'
    },
    productMeta: {
      display: 'flex',
      gap: '20px',
      fontSize: '14px',
      color: '#666'
    },
    customerInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '10px',
      fontSize: '14px'
    },
    customerDetail: {
      color: '#666'
    },
    orderFooter: {
      padding: '15px 20px',
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    orderTotal: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#667eea'
    },
    actionButtons: {
      display: 'flex',
      gap: '10px'
    },
    statusUpdate: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    statusSelectSmall: {
      padding: '5px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '12px'
    },
    updateBtn: {
      padding: '5px 10px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    cancelBtn: {
      padding: '5px 10px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    loading: {
      textAlign: 'center',
      padding: '50px'
    },
    noOrders: {
      textAlign: 'center',
      padding: '50px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>All Orders ({filteredOrders.length})</h1>
        
        <div style={styles.filters}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search by product, customer, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            style={styles.statusSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="order placed">Order Placed</option>
            <option value="processing">Processing</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={styles.noOrders}>
          <p>No orders found</p>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {filteredOrders.map(order => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <span style={styles.orderId}>
                  Order #{order._id.slice(-8)}
                </span>
                <span style={styles.orderDate}>
                  {formatDate(order.orderDate)}
                </span>
                <span style={{
                  ...styles.statusBadge,
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
                  <div style={styles.productInfo}>
                    <h3 style={styles.productTitle}>{order.title}</h3>
                    <div style={styles.productMeta}>
                      {order.size && <span>Size: {order.size}</span>}
                      <span>Quantity: {order.quantity}</span>
                      <span>Payment: {order.paymentMethod}</span>
                    </div>
                  </div>

                  <div style={styles.customerInfo}>
                    <div style={styles.customerDetail}>
                      <strong>Customer:</strong> {order.name}
                    </div>
                    <div style={styles.customerDetail}>
                      <strong>Email:</strong> {order.email}
                    </div>
                    <div style={styles.customerDetail}>
                      <strong>Mobile:</strong> {order.mobile}
                    </div>
                    <div style={styles.customerDetail}>
                      <strong>Address:</strong> {order.address}, {order.pincode}
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.orderFooter}>
                <div style={styles.orderTotal}>
                  Total: ${(getDiscountedPrice(order.price, order.discount) * order.quantity).toFixed(2)}
                </div>

                <div style={styles.actionButtons}>
                  {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                    <div style={styles.statusUpdate}>
                      <select 
                        style={styles.statusSelectSmall}
                        defaultValue=""
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="" disabled>Update Status</option>
                        <option value="order placed">Order Placed</option>
                        <option value="processing">Processing</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  )}

                  {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                    <button 
                      style={styles.cancelBtn}
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrders;