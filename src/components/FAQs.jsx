import React from 'react';
import { Link } from 'react-router-dom';

const FAQs = () => {
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
              <li><Link to="/agriculturists">AGRICULTURISTS</Link></li>
              <li><Link to="/faqs" className="active">FAQS</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <section className="welcome-section">
          <h2>Help & Support</h2>
          <p>Find answers to common questions and get support when you need it</p>
        </section>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">❓</div>
            <h3>Frequently Asked Questions</h3>
            <p>Common questions and answers about farming and our platform</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📞</div>
            <h3>Contact Support</h3>
            <p>Get in touch with our support team for assistance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>User Guide</h3>
            <p>Comprehensive guide to using Cropwise effectively</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQs;
