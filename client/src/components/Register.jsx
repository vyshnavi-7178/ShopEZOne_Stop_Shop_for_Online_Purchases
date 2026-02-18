import React, { useContext, useState } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Register = ({ setIsLogin }) => {
  const { setUsername, setEmail, setPassword, setUsertype, register, loading } = useContext(GeneralContext);
  
  const [localUsername, setLocalUsername] = useState('');
  const [localEmail, setLocalEmail] = useState('');
  const [localPassword, setLocalPassword] = useState('');
  const [localUsertype, setLocalUsertype] = useState('customer');

  const handleRegister = async (e) => {
    e.preventDefault();
    setUsername(localUsername);
    setEmail(localEmail);
    setPassword(localPassword);
    setUsertype(localUsertype);
    await register();
  };

  const styles = {
    form: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#333'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'white'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    link: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#666'
    },
    linkSpan: {
      color: '#667eea',
      cursor: 'pointer',
      fontWeight: '600'
    }
  };

  return (
    <form style={styles.form} onSubmit={handleRegister}>
      <h2 style={styles.title}>Register</h2>

      <div style={styles.inputGroup}>
        <input
          type="text"
          style={styles.input}
          placeholder="Username"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <input
          type="email"
          style={styles.input}
          placeholder="Email address"
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <input
          type="password"
          style={styles.input}
          placeholder="Password (min. 6 characters)"
          value={localPassword}
          onChange={(e) => setLocalPassword(e.target.value)}
          required
          minLength="6"
        />
      </div>

      <div style={styles.inputGroup}>
        <select
          style={styles.select}
          value={localUsertype}
          onChange={(e) => setLocalUsertype(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        style={styles.button}
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Sign Up'}
      </button>

      <p style={styles.link}>
        Already registered?{' '}
        <span style={styles.linkSpan} onClick={() => setIsLogin(true)}>
          Login
        </span>
      </p>
    </form>
  );
};

export default Register;