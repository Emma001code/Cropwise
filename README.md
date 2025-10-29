# 🌾 Cropwise - Farmer-Friendly Agricultural Web Application

[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/yourusername/cropwise)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-4.18+-blue.svg)](https://expressjs.com/)

A comprehensive agricultural web application designed to empower farmers with modern tools for crop management, seasonal guidance, soil analysis, and AI-powered agricultural assistance.

## 🚀 Live Demo

**Access the application:** [http://localhost:3000](http://localhost:3000)

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 User Authentication
- **Secure Registration**: Complete user signup with validation
- **Login System**: Email/password authentication with session management
- **Profile Management**: User profile display and editing
- **Session Security**: Token-based authentication with localStorage

### 🌱 Agricultural Tools
- **Seasonal Guidance**: Comprehensive crop information for all seasons
- **Soil Analysis**: Detailed soil type information and cultivation tips
- **Weather Updates**: Real-time weather information for farming decisions
- **Expert Network**: Connect with agricultural specialists
- **Purchase Supplies**: Integrated marketplace for farming equipment

### 🤖 AI-Powered Assistant
- **DeepSeek AI Integration**: Advanced agricultural chatbot
- **Real-time Chat**: Instant responses to farming queries
- **Specialized Knowledge**: Focused on agricultural best practices
- **Multi-language Support**: Available in multiple languages

### 🛒 E-commerce Features
- **Product Catalog**: Comprehensive farming supplies marketplace
- **Shopping Cart**: Add to cart and checkout functionality
- **Order Management**: Track and manage your orders
- **Secure Payments**: Safe and secure payment processing

### 👥 Community Features
- **Agriculturist Network**: Connect with farming experts
- **Profile Management**: Create and manage expert profiles
- **Specialization Tags**: Find experts by their specialization
- **Location-based Search**: Find local agricultural experts

## 📸 Screenshots

### Dashboard
![Dashboard](images/dashboard-preview.png)
*Main dashboard with feature cards and image carousel*

### Seasonal Information
![Seasonal Info](images/season-wise-preview.png)
*Seasonal crop guidance and planting calendar*

### AI Assistant
![AI Assistant](images/ai-assistant-preview.png)
*AI-powered agricultural chatbot interface*

## 🛠 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/cropwise.git
cd cropwise
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Step 4: Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Step 5: Access the Application
Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Getting Started
1. **Welcome Page**: Start at the landing page
2. **Sign Up**: Create your farmer account
3. **Login**: Access your personalized dashboard
4. **Explore Features**: Navigate through different agricultural tools

### Key Workflows
- **Crop Planning**: Use seasonal guidance for planting decisions
- **Soil Management**: Analyze soil types for optimal cultivation
- **Expert Consultation**: Connect with agricultural specialists
- **Supply Shopping**: Purchase farming equipment and supplies
- **AI Assistance**: Get instant answers to farming questions

## 📁 Project Structure

```
Cropwise/
├── 📁 public/                 # Static assets
│   ├── 📁 images/            # Image resources
│   └── 📁 styles/            # CSS files
├── 📁 src/                   # Source code
│   ├── 📁 components/        # React components (future)
│   └── 📁 utils/             # Utility functions
├── 📄 server.js              # Main server file
├── 📄 package.json           # Dependencies and scripts
├── 📄 .env                   # Environment variables
├── 📄 users.json             # User database
├── 📄 products.json          # Product catalog
├── 📄 orders.json            # Order management
├── 📄 agriculturists.json    # Expert profiles
├── 📄 welcome.html           # Landing page
├── 📄 signup.html            # User registration
├── 📄 login.html             # User authentication
├── 📄 dashboard.html         # Main dashboard
├── 📄 profile.html           # User profile
├── 📄 season-wise.html       # Seasonal information
├── 📄 soil-type.html         # Soil analysis
├── 📄 ai-assistant.html      # AI chatbot
├── 📄 purchase.html          # E-commerce
├── 📄 agriculturists.html    # Expert network
├── 📄 faqs.html              # Help and support
└── 📄 README.md              # This file
```

## 🔌 API Documentation

### Authentication Endpoints
```http
POST /api/signup
Content-Type: application/json

{
  "username": "farmer123",
  "email": "farmer@example.com",
  "password": "securepassword",
  "gender": "male",
  "occupation": "farmer",
  "location": "California, USA"
}
```

```http
POST /api/login
Content-Type: application/json

{
  "username": "farmer@example.com",
  "password": "securepassword"
}
```

### Product Endpoints
```http
GET /api/products
# Returns all available products

GET /api/products/:id
# Returns specific product details

POST /api/orders
# Create new order
```

### Agriculturist Endpoints
```http
GET /api/agriculturists
# Returns all agricultural experts

POST /api/agriculturists
# Register as agricultural expert

PUT /api/agriculturists/:id
# Update expert profile
```

## 🛠 Technologies Used

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **JSON Web Tokens**: Secure authentication
- **bcryptjs**: Password hashing
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript (ES6+)**: Interactive functionality
- **Responsive Design**: Mobile-first approach

### AI Integration
- **OpenRouter API**: AI model access
- **DeepSeek AI**: Agricultural chatbot
- **Axios**: HTTP client for API calls

### Development Tools
- **Nodemon**: Development server
- **Git**: Version control
- **VS Code**: Recommended IDE

## 🎨 Design Features

### UI/UX
- **Glassmorphism**: Modern glass-like effects
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Engaging user interactions
- **Intuitive Navigation**: Easy-to-use interface

### Color Scheme
- **Primary Green**: #2E7D32 (Agricultural theme)
- **Success Green**: #4CAF50 (Notifications)
- **Background**: #f8f9fa (Clean and modern)
- **Text**: #2d3436 (High contrast readability)

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex functionality
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Chibu**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- **OpenRouter**: For AI model access
- **DeepSeek**: For agricultural AI assistance
- **Express.js Community**: For the excellent framework
- **Agricultural Experts**: For domain knowledge and feedback

## 📞 Support

If you encounter any issues or have questions:

1. **Check the FAQ**: Visit [faqs.html](faqs.html) for common questions
2. **Create an Issue**: Use GitHub Issues for bug reports
3. **Contact Support**: Email e.ngwoke@alustudent.com

## 🔮 Roadmap

### Upcoming Features
- [ ] **Mobile App**: React Native version
- [ ] **Weather API**: Real-time weather integration
- [ ] **Soil Testing**: Advanced soil analysis tools
- [ ] **Marketplace**: Enhanced e-commerce features
- [ ] **Community Forum**: Farmer discussion platform
- [ ] **Multi-language**: International support

### Version History
- **v1.0.0** (Current): Initial release with core features
- **v1.1.0** (Planned): Enhanced AI features
- **v2.0.0** (Planned): Mobile app release

---

<div align="center">

**🌾 Built with ❤️ for Farmers Worldwide 🌾**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/cropwise?style=social)](https://github.com/yourusername/cropwise)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/cropwise?style=social)](https://github.com/yourusername/cropwise)

</div>