import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3); // This would come from state management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loginStatus = localStorage.getItem('isLoggedIn');
    
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [navigate]);

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  const features = [
    {
      id: 1,
      title: "Season Wise",
      description: "Discover the best crops to cultivate in different seasons worldwide. Get detailed information about seasonal crops suitable for your region and climate conditions.",
      image: "/images/season wise.jpeg",
      link: "/season-wise"
    },
    {
      id: 2,
      title: "Soil Type",
      description: "Learn about diverse soil types and their suitability for various crops. Get expert advice on soil management, testing, and crop selection for optimal yields.",
      image: "/images/soil type image.webp",
      link: "/soil-type"
    },
    {
      id: 3,
      title: "Purchase Supplies",
      description: "Buy quality seeds, fertilizers, and pesticides from trusted suppliers. Get the best prices and delivery options.",
      image: "/images/cart dsh.png",
      link: "/purchase"
    },
    {
      id: 4,
      title: "Weather Updates",
      description: "Stay informed about weather conditions that affect your farming. Get alerts and recommendations.",
      image: "/images/weather.jpg",
      link: "/weather"
    },
    {
      id: 5,
      title: "Expert Network",
      description: "Connect with agricultural experts and fellow farmers. Get personalized advice and share experiences.",
      image: "/images/nertwork.jpg",
      link: "/agriculturists"
    },
    {
      id: 6,
      title: "Help & Support",
      description: "Find answers to common questions and get support when you need it. We're here to help you succeed.",
      image: "/images/support.jpg",
      link: "/faqs"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>Crop Wise</h1>
            <span className="leaf">🌿</span>
          </div>
          
          <nav>
            <ul className="nav">
              <li><Link to="/" className="active">HOME</Link></li>
              <li><Link to="/ai-assistant">AI ASSISTANT</Link></li>
              <li><Link to="/purchase">PURCHASE</Link></li>
              <li><Link to="/weather">WEATHER</Link></li>
              <li><Link to="/agriculturists">AGRICULTURISTS</Link></li>
              <li><Link to="/faqs">FAQS</Link></li>
            </ul>
          </nav>
          
          <div className="header-actions">
            <button className="cart-btn">
              🛒
              <span className="cart-count">{cartCount}</span>
            </button>
            
            <div className="user-menu">
              <button 
                className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
              </button>
              
              <div className={`dropdown ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="/login" className="dropdown-item">Login</Link>
                <Link to="/signup" className="dropdown-item">Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2>Welcome to Cropwise</h2>
          <p>Your comprehensive agricultural companion for smart farming decisions</p>
        </section>

        {/* Image Carousel */}
        <section className="image-carousel">
          <div className="carousel-container">
            <div className="carousel-overlay">
              <div className="carousel-content">
                <h2>Smart Farming Made Simple</h2>
                <p>Get expert advice, weather updates, and crop recommendations all in one place</p>
                <Link to="/season-wise" className="cta-button">Explore Crops</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="recommendations-section">
          <h3>Our Services</h3>
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">
                  <img src={feature.image} alt={feature.title} className="card-image" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
};

export default Dashboard;
