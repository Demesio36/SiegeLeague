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
    const response = await fetch('https://script.google.com/macros/s/AKfycbxOFQjaB4WAh3Z3Q4oYAMP-7FmXO1Eacn-DDfSdZ_mSQL0qpPNv0-6SjYBGsnKl136bEg/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: event.body
    });

    const contentType = response.headers.get('content-type');
    const result = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    return {
      statusCode: 200,
      body: typeof result === 'string' ? result : JSON.stringify(result),
    };
  } catch (err) {
    console.error('Proxy Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to proxy request' }),
    };
  }
};
