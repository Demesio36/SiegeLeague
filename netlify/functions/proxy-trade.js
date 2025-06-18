import fetch from 'node-fetch';

export const handler = async (event) => {
  const SCRIPT_URL = process.env.SCRIPT_URL;

  if (!SCRIPT_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SCRIPT_URL is not defined' }),
    };
  }

  try {
    if (event.httpMethod === 'POST') {
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
    } else if (event.httpMethod === 'GET') {
      const url = `${SCRIPT_URL}?${event.rawQuery}`;
      const response = await fetch(url);
      const result = await response.text();
      return {
        statusCode: 200,
        body: result,
      };
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
  } catch (err) {
    console.error('Proxy Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy fetch failed' }),
    };
  }
};
