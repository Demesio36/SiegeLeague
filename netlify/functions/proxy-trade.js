// netlify/functions/proxy-trade.js

import fetch from 'node-fetch';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxK9Q_SgyqXMESycU3WL0XTHzU4WSF5T5hBDgl7Xji5S0ZqVg-9e6FS9DMTPm_G4CO_5Q/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: event.body
    });

    const result = await response.text();
    return {
      statusCode: 200,
      body: result,
    };
  } catch (err) {
    console.error('Proxy Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to proxy request' }),
    };
  }
};
