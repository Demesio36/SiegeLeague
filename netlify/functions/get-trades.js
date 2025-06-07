const fs = require("fs");
const path = require("path");

const tradesFilePath = path.resolve(__dirname, "data", "trades.json");

exports.handler = async () => {
  try {
    const data = fs.readFileSync(tradesFilePath);
    return {
      statusCode: 200,
      body: data.toString(),
      headers: { "Content-Type": "application/json" }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Error loading trades."
    };
  }
};
