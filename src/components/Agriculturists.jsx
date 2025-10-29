import React from 'react';
import { Link } from 'react-router-dom';

const Agriculturists = () => {
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
          <nav>
            <ul className="nav">
              <li><Link to="/">HOME</Link></li>
              <li><Link to="/purchase">PURCHASE</Link></li>
              <li><Link to="/weather">WEATHER</Link></li>
              <li><Link to="/agriculturists" className="active">AGRICULTURISTS</Link></li>
              <li><Link to="/faqs">FAQS</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <section className="welcome-section">
          <h2>Expert Network</h2>
          <p>Connect with agricultural experts and fellow farmers</p>
        </section>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🌾</div>
            <h3>Local Experts</h3>
            <p>Find agricultural experts in your area</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Farmer Community</h3>
            <p>Connect with fellow farmers and share experiences</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Expert Consultations</h3>
            <p>Get personalized advice from agricultural professionals</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Agriculturists;
