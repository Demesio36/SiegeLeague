const fs = require("fs");
const path = require("path");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const newTrade = JSON.parse(event.body);

    const tradesPath = path.join(__dirname, "../../public/trades.json");

    // Load existing trades
    let existingTrades = [];
    if (fs.existsSync(tradesPath)) {
      const data = fs.readFileSync(tradesPath, "utf8");
      existingTrades = JSON.parse(data);
    }

    // Add the new trade
    existingTrades.push(newTrade);

    // Save back to file
    fs.writeFileSync(tradesPath, JSON.stringify(existingTrades, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Trade offer recorded." }),
    };
  } catch (err) {
    console.error("Error saving trade:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error saving trade." }),
    };
  }
};
