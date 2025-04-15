// netlify/functions/chatbot.js
const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: true, message: 'Method Not Allowed' })
    };
  }
  
  try {
    // API key is securely stored in Netlify environment variables
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      throw new Error('API key not configured');
    }
    
    // Parse the incoming request
    const requestBody = JSON.parse(event.body);
    const { message, session_id } = requestBody;
    
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: true, message: 'Message is required' })
      };
    }
    
    // Get resume content (in a real implementation, you might want to store this in a variable or load from a file)
    const resumeContent = "Pranav Shridhar Kowadkar - Data Scientist / ML Engineer specializing in machine learning, deep learning, and data engineering with expertise in Python, TensorFlow, and AWS cloud technologies."; // This is just a placeholder
    
    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: `You are Pranav's AI assistant. Answer questions about Pranav's experience, education, skills, projects, and contact information based on the following resume content:\n\n${resumeContent}`
          },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Return the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Add CORS headers
      },
      body: JSON.stringify({
        message: response.data.choices[0].message.content,
        session_id: session_id
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Add CORS headers
      },
      body: JSON.stringify({ 
        error: true, 
        message: "I'm having trouble connecting to my brain right now. Please try again later.",
        debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      })
    };
  }
};