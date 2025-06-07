const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const trade = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,        
      pass: process.env.EMAIL_APP_PASSWORD 
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Trade Accepted: ${trade.username} <-> ${trade.targetPlayer}`,
    text: `
A trade has been accepted!

From: ${trade.username}
Operator Offered: ${trade.yourOperator}

To: ${trade.targetPlayer}
Operator Accepted: ${trade.targetOperator}

Accepted on: ${new Date().toLocaleString()}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
