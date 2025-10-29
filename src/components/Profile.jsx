import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loginStatus = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (loginStatus === 'true' && currentUser) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(currentUser));
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (!isLoggedIn || !userData) {
    return <div>Loading...</div>;
  }

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
              <li><Link to="/dashboard">HOME</Link></li>
              <li><Link to="/ai-assistant">AI ASSISTANT</Link></li>
              <li><Link to="/purchase">PURCHASE</Link></li>
              <li><Link to="/weather">WEATHER</Link></li>
              <li><Link to="/agriculturists">AGRICULTURISTS</Link></li>
              <li><Link to="/faqs">FAQS</Link></li>
            </ul>
          </nav>
          <div className="header-actions">
            <button 
              onClick={handleLogout}
              style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">
        <section className="welcome-section">
          <h2>Your Profile</h2>
          <p>Welcome back, {userData.firstName}!</p>
        </section>
        
        <div className="features-grid">
          <div className="feature-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="feature-icon">👤</div>
            <h3>Personal Information</h3>
            <div style={{ textAlign: 'left', marginTop: '1rem' }}>
              <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>Basic Details</h4>
                <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Phone:</strong> {userData.phone || 'Not provided'}</p>
              </div>
              
              <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>Farming Information</h4>
                <p><strong>Farm Location:</strong> {userData.farmLocation || 'Not provided'}</p>
                <p><strong>Farm Size:</strong> {userData.farmSize ? `${userData.farmSize} acres` : 'Not provided'}</p>
                <p><strong>Experience Level:</strong> {userData.experience ? userData.experience.charAt(0).toUpperCase() + userData.experience.slice(1) : 'Not specified'}</p>
              </div>
              
              <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>Account Information</h4>
                <p><strong>Member Since:</strong> {new Date(userData.signupDate).toLocaleDateString()}</p>
                <p><strong>Account ID:</strong> #{userData.id}</p>
              </div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Account Settings</h3>
            <p>Manage your account preferences and notifications</p>
            <button 
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Edit Profile
            </button>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <h3>Farming Preferences</h3>
            <p>Update your farming interests and crop preferences</p>
            <button 
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Update Preferences
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
