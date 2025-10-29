import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AIChatWidget = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome! I'm your agricultural AI assistant. Ask me anything about farming, crops, pests, soil management, or any other agricultural topics!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call backend API (secure - API key is on server, not exposed)
      const response = await axios.post('/api/ai-chat', {
        message: inputMessage
      });

      const aiResponse = {
        id: Date.now() + 1,
        text: response.data.message,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact a local agricultural expert for immediate assistance.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`ai-chat-widget ${isMinimized ? 'minimized' : ''}`}>
      <div 
        className="chat-header"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <span>🌾 AI Assistant</span>
        <button className="minimize-btn">
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>
      
      {!isMinimized && (
        <>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.isUser ? 'user' : 'ai'}`}>
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-container">
            <div className="chat-input-form">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask about farming, crops, pests..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                className="send-button"
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIChatWidget;
