const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const acceptedTrade = JSON.parse(event.body);

  const playersPath = path.join(__dirname, "./public/players.json");
  const tradesPath = path.join(__dirname, "./public/trades.json");

  try {
    // Load current data
    const players = JSON.parse(fs.readFileSync(playersPath, "utf-8"));
    const trades = JSON.parse(fs.readFileSync(tradesPath, "utf-8"));

    const {
      username,
      yourOperator,
      targetPlayer,
      targetOperator
    } = acceptedTrade;

    // Handle Free Ops
    if (targetPlayer.toLowerCase() === "free ops") {
      // Remove from Free Ops
      players["Free Ops"] = players["Free Ops"].filter(op => op !== targetOperator);
      // Add to user
      players[username].push(targetOperator);
    } else {
      // Swap operators
      players[username] = players[username].filter(op => op !== yourOperator);
      players[targetPlayer] = players[targetPlayer].filter(op => op !== targetOperator);

      players[username].push(targetOperator);
      players[targetPlayer].push(yourOperator);
    }

    // Remove the accepted trade from trades.json
    const updatedTrades = trades.filter(trade =>
      !(
        trade.username === username &&
        trade.yourOperator === yourOperator &&
        trade.targetPlayer === targetPlayer &&
        trade.targetOperator === targetOperator
      )
    );

    // Save updated files
    fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    fs.writeFileSync(tradesPath, JSON.stringify(updatedTrades, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Trade completed and files updated." })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
