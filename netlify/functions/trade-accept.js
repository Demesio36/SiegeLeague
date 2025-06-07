const fs = require("fs");
const path = require("path");

const tradesFilePath = path.resolve(__dirname, "data", "trades.json");
const playersFilePath = path.resolve(__dirname, "data", "players.json");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const acceptedTrade = JSON.parse(event.body);

    // Load existing trades
    let trades = JSON.parse(fs.readFileSync(tradesFilePath));
    let players = JSON.parse(fs.readFileSync(playersFilePath));

    // Find and mark the trade as accepted
    let found = false;
    trades = trades.map(trade => {
      if (
        !trade.accepted &&
        trade.username === acceptedTrade.username &&
        trade.targetPlayer === acceptedTrade.targetPlayer &&
        trade.yourOperator === acceptedTrade.yourOperator &&
        trade.targetOperator === acceptedTrade.targetOperator
      ) {
        trade.accepted = true;
        found = true;
      }
      return trade;
    });

    if (!found) {
      return {
        statusCode: 404,
        body: "Trade not found or already accepted"
      };
    }

    // Do the operator swap
    const sender = acceptedTrade.username;
    const receiver = acceptedTrade.targetPlayer;
    const senderOp = acceptedTrade.yourOperator;
    const receiverOp = acceptedTrade.targetOperator;

    // Remove and swap operators
    if (!players[sender] || !players[receiver]) {
      return { statusCode: 400, body: "Players not found" };
    }

    const senderIndex = players[sender].indexOf(senderOp);
    const receiverIndex = players[receiver].indexOf(receiverOp);

    if (senderIndex === -1 || receiverIndex === -1) {
      return { statusCode: 400, body: "Operators not found" };
    }

    // Swap operators
    players[sender][senderIndex] = receiverOp;
    players[receiver][receiverIndex] = senderOp;

    // Save updated trades and players
    fs.writeFileSync(tradesFilePath, JSON.stringify(trades, null, 2));
    fs.writeFileSync(playersFilePath, JSON.stringify(players, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Trade accepted and players updated." })
    };

  } catch (err) {
    console.error("Error processing trade accept:", err);
    return {
      statusCode: 500,
      body: "Error processing trade accept: " + err.toString()
    };
  }
};
