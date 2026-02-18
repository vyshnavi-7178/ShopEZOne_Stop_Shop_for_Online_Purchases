import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0
  });
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:6001';

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/auth');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin-stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBanner = async () => {
    if (!banner.trim()) {
      alert('Please enter a banner URL');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/update-banner`, { banner });
      if (response.data.success) {
        alert('Banner updated successfully');
        setBanner('');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Failed to update banner');
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#333'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '40px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      textAlign: 'center'
    },
    statValue: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '10px'
    },
    statLabel: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '15px'
    },
    statBtn: {
      padding: '8px 20px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    bannerSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    bannerTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#333'
    },
    bannerInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      marginBottom: '15px'
    },
    updateBtn: {
      padding: '10px 25px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
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
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.users}</div>
          <div style={styles.statLabel}>Total Users</div>
          <button 
            style={styles.statBtn}
            onClick={() => navigate('/all-users')}
          >
            View All
          </button>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.products}</div>
          <div style={styles.statLabel}>Total Products</div>
          <button 
            style={styles.statBtn}
            onClick={() => navigate('/all-products')}
          >
            View All
          </button>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.orders}</div>
          <div style={styles.statLabel}>Total Orders</div>
          <button 
            style={styles.statBtn}
            onClick={() => navigate('/all-orders')}
          >
            View All
          </button>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>+</div>
          <div style={styles.statLabel}>Add Product</div>
          <button 
            style={styles.statBtn}
            onClick={() => navigate('/new-product')}
          >
            Add Now
          </button>
        </div>
      </div>

      {/* Banner Update */}
      <div style={styles.bannerSection}>
        <h2 style={styles.bannerTitle}>Update Homepage Banner</h2>
        <input
          type="text"
          style={styles.bannerInput}
          placeholder="Enter banner image URL"
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
        />
        <button 
          style={styles.updateBtn}
          onClick={updateBanner}
        >
          Update Banner
        </button>
      </div>
    </div>
  );
};

export default Admin;