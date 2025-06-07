// trade-offer.js
const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const tradePath = path.resolve("./public/trades.json");
  const newTrade = JSON.parse(event.body);

  try {
    const data = fs.readFileSync(tradePath, "utf8");
    const trades = JSON.parse(data);
    trades.push(newTrade);
    fs.writeFileSync(tradePath, JSON.stringify(trades, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Trade offer saved" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error writing trade offer: ${err}`
    };
  }
};

// trade-accept.js
const fs2 = require("fs");
const path2 = require("path");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const trade = JSON.parse(event.body);
  const tradePath = path2.resolve("./public/trades.json");
  const playersPath = path2.resolve("./public/players.json");

  try {
    const trades = JSON.parse(fs2.readFileSync(tradePath, "utf8"));
    const players = JSON.parse(fs2.readFileSync(playersPath, "utf8"));

    // Update trade as accepted
    const updatedTrades = trades.map(t => {
      if (
        t.username === trade.username &&
        t.yourOperator === trade.yourOperator &&
        t.targetPlayer === trade.targetPlayer &&
        t.targetOperator === trade.targetOperator
      ) {
        t.accepted = true;
      }
      return t;
    });

    // Swap the operators
    const userOps = players[trade.username];
    const targetOps = players[trade.targetPlayer];

    const youIdx = userOps.indexOf(trade.yourOperator);
    const themIdx = targetOps.indexOf(trade.targetOperator);

    if (youIdx !== -1 && themIdx !== -1) {
      userOps[youIdx] = trade.targetOperator;
      targetOps[themIdx] = trade.yourOperator;
    }

    fs2.writeFileSync(tradePath, JSON.stringify(updatedTrades, null, 2));
    fs2.writeFileSync(playersPath, JSON.stringify(players, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Trade accepted and players updated" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error accepting trade: ${err}`
    };
  }
};
