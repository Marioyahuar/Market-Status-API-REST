const express = require("express");
const path = require("path");
const WebSocket = require("ws");
const BOOKS = require("./helpers/bitfinexBooks");
const helpers = require("./helpers/helpers.js");
const app = express();

//settings

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares

// routes
app.use(require("./routes/routes.js"));

// static files
app.use(express.static(path.join(__dirname, "public")));

//404
app.use((req, res) => {
  res.status(404).end("404 Not Found");
});

const server = app.listen(app.get("port"), () => {
  console.log("server on port 3000");
});

//WebSocket connection with client to stream tips of the desired orderbook in real-time
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const selectedPair = JSON.parse(message).selectedPair;

    // Periodically send updated orderbook data to the connected client
    setInterval(() => {
      const bookIndex = helpers.getOrderbookIndexBySymbol(BOOKS, selectedPair);
      const tips =
        bookIndex != -1
          ? helpers.getTips(BOOKS[bookIndex])
          : "API does not support this pair yet =( If you want to add this pair please contact me: myahuarcanisalinas@gmail.com";

      const formattedData = `<pre>
      <strong>Best Bid</strong><br>
      price: ${tips.bestBid.price}<br>
      amount: ${tips.bestBid.amount.toFixed(5)}<br>
      <br>
      <strong>Best Ask</strong><br>
      price: ${tips.bestAsk.price}<br>
      amount: ${tips.bestAsk.amount.toFixed(5)}<br>
      </pre>`;

      ws.send(JSON.stringify(formattedData));
    }, 1000);
  });
});

module.exports = wss;
