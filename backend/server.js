const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Install with: npm install node-fetch@2

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your OpenRouter API key (https://openrouter.ai/keys)
const OPENROUTER_API_KEY = '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';

// Forward AI requests to OpenRouter
app.post('/analyze-image', async (req, res) => {
  try {
    console.log('Received analysis request');
    
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000', // Your frontend URL
        'X-Title': 'Neurashala AI', // Your app name
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body) // Forward the frontend's request
    });

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter error: ${openRouterResponse.statusText}`);
    }

    const responseData = await openRouterResponse.json();
    res.json(responseData);
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Failed to analyze image',
      details: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});