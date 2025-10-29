import React from 'react';
import { Link } from 'react-router-dom';

const Weather = () => {
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
              <li><Link to="/weather" className="active">WEATHER</Link></li>
              <li><Link to="/agriculturists">AGRICULTURISTS</Link></li>
              <li><Link to="/faqs">FAQS</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <section className="welcome-section">
          <h2>Weather Updates</h2>
          <p>Stay informed about weather conditions that affect your farming</p>
        </section>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌤️</div>
            <h3>Current Weather</h3>
            <p>Real-time weather conditions for your location</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>7-Day Forecast</h3>
            <p>Extended weather forecast for planning your farming activities</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚠️</div>
            <h3>Weather Alerts</h3>
            <p>Important weather warnings and recommendations</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Weather;
