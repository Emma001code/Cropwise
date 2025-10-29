from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import json
import os

app = Flask(__name__)
CORS(app)

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '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')
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Agricultural context for the AI
AGRICULTURAL_SYSTEM_PROMPT = """
You are an expert agricultural advisor for Cropwise, a farming management platform. 
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
Be friendly, helpful, and encourage sustainable farming practices.
"""

@app.route('/')
def index():
    return render_template('chatbot.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Prepare the API request
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://cropwise.com",
            "X-Title": "Cropwise AI Assistant"
        }
        
        # Try multiple models in order of preference
        models_to_try = [
            "deepseek/deepseek-r1:free",
            "meta-llama/llama-3.2-3b-instruct:free",
            "microsoft/phi-3-mini-128k-instruct:free",
            "google/gemma-2-9b-it:free"
        ]
        
        for model in models_to_try:
            payload = {
                "model": model,
                "messages": [
                    {
                        "role": "system",
                        "content": AGRICULTURAL_SYSTEM_PROMPT
                    },
                    {
                        "role": "user",
                        "content": user_message
                    }
                ],
                "max_tokens": 1000,
                "temperature": 0.7
            }
            
            try:
                response = requests.post(
                    url=OPENROUTER_URL,
                    headers=headers,
                    data=json.dumps(payload),
                    timeout=30
                )
                
                if response.status_code == 200:
                    result = response.json()
                    ai_message = result['choices'][0]['message']['content']
                    
                    return jsonify({
                        'success': True,
                        'message': ai_message,
                        'timestamp': result.get('created', ''),
                        'model_used': model
                    })
                elif response.status_code == 429:
                    # Try next model
                    continue
                else:
                    # Try next model
                    continue
                    
            except Exception as e:
                # Try next model
                continue
        
        # If all models fail, provide fallback
        fallback_response = """
I'm currently experiencing high demand and all AI models are temporarily unavailable. 

Here are some general tips for crops that are drying up:

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

Please try again in a few minutes, or contact a local agricultural expert for immediate assistance.
        """
        return jsonify({
            'success': True,
            'message': fallback_response,
            'timestamp': 'fallback_response',
            'model_used': 'fallback'
        })
            
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout. Please try again.'}), 408
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Network error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'Cropwise AI Chatbot'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
