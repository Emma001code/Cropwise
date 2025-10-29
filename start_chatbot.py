#!/usr/bin/env python3
"""
Cropwise AI Chatbot Startup Script
This script installs dependencies and starts the chatbot server.
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required Python packages"""
    print("🔧 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Packages installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing packages: {e}")
        return False

def start_server():
    """Start the Flask chatbot server"""
    print("🚀 Starting Cropwise AI Chatbot...")
    print("📱 Open your browser and go to: http://localhost:5000")
    print("🌾 The AI assistant is ready to help with agricultural questions!")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        from chatbot_server import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n👋 Chatbot server stopped. Goodbye!")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main function"""
    print("🌾 Welcome to Cropwise AI Chatbot Setup!")
    print("=" * 50)
    
    # Check if requirements.txt exists
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt not found!")
        return
    
    # Install requirements
    if not install_requirements():
        return
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
