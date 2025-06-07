
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const DATA_PATH = path.join(__dirname, "trades.json");
const EMAIL = process.env.EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS;

exports.handler = async function (event, context) {
  if (event.httpMethod === "GET") {
    const user = event.queryStringParameters.user;
    const trades = readTrades();
    const incoming = trades.filter(t => t.targetPlayer === user && t.status === "pending");
    return respond(200, incoming);
  }

  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);

    if (body.type === "storeTrade") {
      const trades = readTrades();
      trades.push(body);
      writeTrades(trades);
      return respond(200, { message: "Trade stored" });
    }

    if (body.type === "acceptTrade") {
      const trades = readTrades();
      const index = trades.findIndex(t =>
        t.from === body.from &&
        t.targetPlayer === body.targetPlayer &&
        t.yourOperator === body.yourOperator &&
        t.targetOperator === body.targetOperator &&
        t.status === "pending"
      );

      if (index !== -1) {
        trades[index].status = "accepted";
        writeTrades(trades);
        await sendEmail(body);
        return respond(200, { message: "Trade accepted and email sent" });
      }
      return respond(404, { error: "Trade not found" });
    }
  }

  return respond(405, { error: "Method Not Allowed" });
};

function readTrades() {
  try {
    const raw = fs.readFileSync(DATA_PATH);
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeTrades(trades) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(trades, null, 2));
}

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}

async function sendEmail(trade) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASS
    }
  });

  const mailOptions = {
    from: EMAIL,
    to: EMAIL,
    subject: "Trade Accepted",
    text: `${trade.targetPlayer} accepted your trade. Your ${trade.yourOperator} for their ${trade.targetOperator}`
  };

  await transporter.sendMail(mailOptions);
}
