import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple login - just check if both fields are filled
    if (email && password) {
      // Store login status
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      alert('Please fill in both email and password!');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              <h1>Crop Wise</h1>
              <span className="leaf">🌿</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="main-content">
        <section className="welcome-section">
          <h2>Login to Cropwise</h2>
          <p>Access your agricultural dashboard and AI assistant</p>
        </section>
        
        <div className="features-grid">
          <div className="feature-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <form onSubmit={handleLogin}>
              <div className="feature-icon">🔐</div>
              <h3>Login</h3>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}
              />
              <button
                type="submit"
                style={{ width: '100%', padding: '0.5rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Login
              </button>
              <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Don't have an account? <Link to="/signup">Sign up here</Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
