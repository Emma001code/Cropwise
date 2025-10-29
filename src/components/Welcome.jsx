import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>Crop Wise</h1>
            <span className="leaf">🌿</span>
          </div>
        </div>
      </header>
      <main className="main-content">
        <section className="welcome-section">
          <h2>Welcome to Cropwise!</h2>
          <p>Your comprehensive agricultural companion for smart farming decisions</p>
        </section>
        <div className="features-grid">
          <div className="feature-card">
            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">🔐</div>
              <h3>Login</h3>
              <p>Access your account and dashboard</p>
            </Link>
          </div>
          <div className="feature-card">
            <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">🌱</div>
              <h3>Sign Up</h3>
              <p>Create your account and start farming</p>
            </Link>
          </div>
          <div className="feature-card">
            <Link to="/ai-assistant" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">🤖</div>
              <h3>AI Assistant</h3>
              <p>Get expert agricultural advice</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
