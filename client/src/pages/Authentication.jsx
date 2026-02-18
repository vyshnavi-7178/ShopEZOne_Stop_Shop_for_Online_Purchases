import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);

  const styles = {
    container: {
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }
  };

  return (
    <div style={styles.container}>
      {isLogin ? (
        <Login setIsLogin={setIsLogin} />
      ) : (
        <Register setIsLogin={setIsLogin} />
      )}
    </div>
  );
};

export default Authentication;