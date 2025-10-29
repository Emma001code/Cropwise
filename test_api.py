#!/usr/bin/env python3
"""
Test script to check OpenRouter API key functionality
"""

import requests
import json

# Your API key
API_KEY = "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"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

def test_api():
    """Test the OpenRouter API with a simple request"""
    print("🔍 Testing OpenRouter API...")
    print(f"API Key: {API_KEY[:20]}...")
    print(f"URL: {API_URL}")
    print("-" * 50)
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cropwise.com",
        "X-Title": "Cropwise AI Assistant"
    }
    
    payload = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [
            {
                "role": "user",
                "content": "Hello, this is a test message."
            }
        ],
        "max_tokens": 50
    }
    
    try:
        print("📤 Sending test request...")
        response = requests.post(
            url=API_URL,
            headers=headers,
            data=json.dumps(payload),
            timeout=30
        )
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS! API is working!")
            print(f"🤖 AI Response: {result['choices'][0]['message']['content']}")
        else:
            print("❌ ERROR!")
            print(f"Response: {response.text}")
            
            if response.status_code == 429:
                print("\n🚨 Rate Limit Error - This suggests:")
                print("- Your account has hit its usage limit")
                print("- Even free accounts have limits")
                print("- Check your OpenRouter dashboard")
            elif response.status_code == 401:
                print("\n🚨 Authentication Error - This suggests:")
                print("- Invalid API key")
                print("- Account not activated")
                print("- Check your OpenRouter account")
            elif response.status_code == 402:
                print("\n🚨 Payment Required - This suggests:")
                print("- Account needs payment method")
                print("- Free credits exhausted")
                print("- Check your OpenRouter billing")
                
    except Exception as e:
        print(f"❌ Network Error: {e}")

if __name__ == "__main__":
    test_api()
