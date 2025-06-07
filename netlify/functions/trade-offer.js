const fs = require("fs");
const path = require("path");

const tradesFilePath = path.resolve(__dirname, "data", "trades.json");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const trade = JSON.parse(event.body);

    let trades = [];
    if (fs.existsSync(tradesFilePath)) {
      trades = JSON.parse(fs.readFileSync(tradesFilePath));
    }

    trades.push(trade);
    fs.writeFileSync(tradesFilePath, JSON.stringify(trades, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Trade saved successfully." }),
    };
  } catch (err) {
    console.error("Error saving trade:", err);
    return {
      statusCode: 500,
      body: "Error saving trade: " + err.toString(),
    };
  }
};
