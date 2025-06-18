// netlify/functions/proxy-trade.js

import fetch from 'node-fetch';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const SCRIPT_URL = process.env.SCRIPT_URL;

  if (!SCRIPT_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SCRIPT_URL not configured' }),
    };
  }

  try {
    const response = await fetch(SCRIPT_URL, {
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
