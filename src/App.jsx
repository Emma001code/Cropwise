import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SeasonWise from './components/SeasonWise';
import SoilType from './components/SoilType';
import Purchase from './components/Purchase';
import Weather from './components/Weather';
import Agriculturists from './components/Agriculturists';
import FAQs from './components/FAQs';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Welcome from './components/Welcome';
import AIAssistant from './components/AIAssistant';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/season-wise" element={<SeasonWise />} />
          <Route path="/soil-type" element={<SoilType />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/agriculturists" element={<Agriculturists />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
