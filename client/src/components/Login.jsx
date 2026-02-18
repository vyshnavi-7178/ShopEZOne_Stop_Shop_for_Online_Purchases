import React, { useContext, useState } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Login = ({ setIsLogin }) => {
  const { setEmail, setPassword, login, loading } = useContext(GeneralContext);
  const [localEmail, setLocalEmail] = useState('');
  const [localPassword, setLocalPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmail(localEmail);
    setPassword(localPassword);
    await login();
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
    <form style={styles.form} onSubmit={handleLogin}>
      <h2 style={styles.title}>Login</h2>
      
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
          placeholder="Password"
          value={localPassword}
          onChange={(e) => setLocalPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        style={styles.button}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Sign In'}
      </button>

      <p style={styles.link}>
        Not registered?{' '}
        <span style={styles.linkSpan} onClick={() => setIsLogin(false)}>
          Register
        </span>
      </p>
    </form>
  );
};

export default Login;