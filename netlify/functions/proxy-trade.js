// netlify/functions/proxy-trade.js
import fetch from 'node-fetch';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbztmz515GjlvCcsujCfDi-sRWT5ij9Pv_CptvZDxU4E1SQYgxoJJD6SUI1WYo82-JjgwQ/exec';

export const handler = async (event) => {
  const method = event.httpMethod;

  if (method === 'POST') {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: event.body
      });

      const result = await getResponseContent(response);
      return {
        statusCode: 200,
        body: typeof result === 'string' ? result : JSON.stringify(result),
      };
    } catch (err) {
      console.error('POST Proxy Error:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to proxy POST request' }),
      };
    }
  }

  if (method === 'GET') {
    try {
      const url = `${GOOGLE_SCRIPT_URL}?${event.rawQuery || ''}`;
      const response = await fetch(url);
      const result = await getResponseContent(response);
      return {
        statusCode: 200,
        body: typeof result === 'string' ? result : JSON.stringify(result),
      };
    } catch (err) {
      console.error('GET Proxy Error:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to proxy GET request' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};

async function getResponseContent(response) {
  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json')
    ? await response.json()
    : await response.text();
}
