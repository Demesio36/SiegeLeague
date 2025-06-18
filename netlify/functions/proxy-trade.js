// netlify/functions/proxy-trade.js

import fetch from 'node-fetch';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const result = await response.text();
    return res.status(200).send(result);
  } catch (err) {
    console.error('Proxy Error:', err);
    return res.status(500).json({ error: 'Failed to proxy request' });
  }
};
