// File: netlify/functions/tradeHandler.js

export async function handler(event, context) {
  const nodemailer = await import('nodemailer');

  const trades = []; // In-memory trade store (replace with real DB or Netlify KV later)

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

  if (event.httpMethod === "GET") {
    const url = new URL(event.rawUrl);
    const type = url.searchParams.get("type");
    const user = url.searchParams.get("user");

    if (type === "incoming") {
      const userTrades = trades.filter(t => t.targetPlayer === user);
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(userTrades)
      };
    }
  }

  if (event.httpMethod === "POST") {
    const data = JSON.parse(event.body);

    if (data.type === "storeTrade") {
      trades.push(data);
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: "Trade stored"
      };
    }

    if (data.type === "acceptTrade") {
      const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "Trade Accepted",
        text: `${data.targetPlayer} accepted the trade: ${data.yourOperator} for ${data.targetOperator}`
      });

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: "Trade accepted and email sent"
      };
    }
  }

  return {
    statusCode: 405,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: "Method Not Allowed"
  };
}
