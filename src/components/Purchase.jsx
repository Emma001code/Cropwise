import React from 'react';
import { Link } from 'react-router-dom';

const Purchase = () => {
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
              <li><Link to="/purchase" className="active">PURCHASE</Link></li>
              <li><Link to="/weather">WEATHER</Link></li>
              <li><Link to="/agriculturists">AGRICULTURISTS</Link></li>
              <li><Link to="/faqs">FAQS</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <section className="welcome-section">
          <h2>Purchase Supplies</h2>
          <p>Buy quality seeds, fertilizers, and pesticides from trusted suppliers</p>
        </section>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Seeds</h3>
            <p>High-quality seeds for all your farming needs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧪</div>
            <h3>Fertilizers</h3>
            <p>Organic and chemical fertilizers for optimal crop growth</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Pesticides</h3>
            <p>Safe and effective pest control solutions</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Purchase;
