import React from 'react';
import { Link } from 'react-router-dom';

const SeasonWise = () => {
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
          <h2>Season Wise Crop Recommendations</h2>
          <p>Discover the best crops to cultivate in different seasons worldwide</p>
        </section>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Spring Crops</h3>
            <p>Perfect crops for spring planting including tomatoes, lettuce, and carrots</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">☀️</div>
            <h3>Summer Crops</h3>
            <p>Heat-loving crops like corn, peppers, and melons for summer growing</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🍂</div>
            <h3>Fall Crops</h3>
            <p>Cool-season vegetables like broccoli, spinach, and root crops</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">❄️</div>
            <h3>Winter Crops</h3>
            <p>Cold-hardy crops that can survive winter conditions</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeasonWise;
