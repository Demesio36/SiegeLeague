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
    const response = await fetch('https://script.google.com/macros/s/AKfycbz4OqaNzVHamo4hp5P0h4tNKeCIIDgokzagVGCJv-nNbl62i1-4U2b2dm98L7uFjeOX4g/exec', {
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
