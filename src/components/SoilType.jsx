import React from 'react';
import { Link } from 'react-router-dom';

const SoilType = () => {
  return (
    <div className="dashboard-container">
      {/* Header */}
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
              <li><Link to="/faqs">FAQS</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className="welcome-section">
          <h2>Soil Type Analysis</h2>
          <p>Learn about diverse soil types and their suitability for various crops</p>
        </section>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏔️</div>
            <h3>Clay Soil</h3>
            <p>Heavy, water-retentive soil perfect for root vegetables and water-loving plants</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏖️</div>
            <h3>Sandy Soil</h3>
            <p>Light, well-draining soil ideal for drought-tolerant crops and quick-draining plants</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌿</div>
            <h3>Loamy Soil</h3>
            <p>The perfect balance - ideal for most crops with excellent water retention and drainage</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🧪</div>
            <h3>Soil Testing</h3>
            <p>Get your soil tested to understand pH levels, nutrients, and composition</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SoilType;
