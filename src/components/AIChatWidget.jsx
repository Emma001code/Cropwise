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
      // Try multiple AI models
      const models = [
        "deepseek/deepseek-r1:free",
        "meta-llama/llama-3.2-3b-instruct:free",
        "microsoft/phi-3-mini-128k-instruct:free",
        "google/gemma-2-9b-it:free"
      ];

      let response = null;
      let aiMessage = null;

      for (const model of models) {
        try {
          const result = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: model,
            messages: [
              {
                role: "system",
                content: `You are an expert agricultural advisor for Cropwise, a farming management platform. 
                You help farmers with:
                - Crop selection and planning
                - Pest and disease identification
                - Soil management advice
                - Weather impact on farming
                - Harvest timing
                - Irrigation and water management
                - Organic farming practices
                - Market trends and pricing

                Always provide practical, actionable advice based on scientific farming principles.
                Be friendly, helpful, and encourage sustainable farming practices.`
              },
              {
                role: "user",
                content: inputMessage
              }
            ],
            max_tokens: 1000,
            temperature: 0.7
          }, {
            headers: {
              'Authorization': 'Bearer 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',
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://cropwise.com',
              'X-Title': 'Cropwise AI Assistant'
            },
            timeout: 30000
          });

          if (result.status === 200) {
            aiMessage = result.data.choices[0].message.content;
            break;
          }
        } catch (error) {
          if (error.response?.status === 429) {
            // Try next model
            continue;
          } else {
            throw error;
          }
        }
      }

      // If all models fail, provide fallback response
      if (!aiMessage) {
        aiMessage = `I'm currently experiencing high demand and all AI models are temporarily unavailable. 

Here are some general tips for your question:

🌱 **Immediate Actions:**
- Check soil moisture levels
- Increase watering frequency
- Apply mulch to retain moisture
- Check for root damage or pests

💧 **Watering Tips:**
- Water deeply but less frequently
- Water early morning or evening
- Avoid watering leaves to prevent disease

🔍 **Diagnosis:**
- Check for signs of pests or disease
- Test soil pH and nutrient levels
- Monitor weather conditions

Please try again in a few minutes, or contact a local agricultural expert for immediate assistance.`;
      }

      const aiResponse = {
        id: Date.now() + 1,
        text: aiMessage,
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
