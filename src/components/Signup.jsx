import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
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
          <h2>Join Cropwise</h2>
          <p>Create your account and start your smart farming journey</p>
        </section>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Free Account</h3>
            <p>Get started with a free account and basic features</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Access our agricultural AI assistant for expert advice</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community</h3>
            <p>Connect with farmers and agricultural experts</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
