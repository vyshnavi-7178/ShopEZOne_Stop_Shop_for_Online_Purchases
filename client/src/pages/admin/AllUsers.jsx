import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE = 'http://localhost:6001';

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/auth');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/fetch-users`);
      if (response.data.success) {
        // Filter out admin users
        const customers = response.data.data.filter(user => user.usertype === 'customer');
        setUsers(customers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
    searchInput: {
      width: '100%',
      maxWidth: '400px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      marginBottom: '20px'
    },
    usersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px'
    },
    userCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    userName: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#333'
    },
    userDetail: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    label: {
      fontWeight: '600',
      minWidth: '80px'
    },
    value: {
      color: '#333'
    },
    loading: {
      textAlign: 'center',
      padding: '50px'
    },
    noUsers: {
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
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>All Users ({filteredUsers.length})</h1>
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div style={styles.noUsers}>
          <p>No users found</p>
        </div>
      ) : (
        <div style={styles.usersGrid}>
          {filteredUsers.map(user => (
            <div key={user._id} style={styles.userCard}>
              <h3 style={styles.userName}>{user.username}</h3>
              <div style={styles.userDetail}>
                <span style={styles.label}>Email:</span>
                <span style={styles.value}>{user.email}</span>
              </div>
              <div style={styles.userDetail}>
                <span style={styles.label}>User ID:</span>
                <span style={styles.value}>{user._id.slice(-8)}</span>
              </div>
              <div style={styles.userDetail}>
                <span style={styles.label}>Joined:</span>
                <span style={styles.value}>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUsers;