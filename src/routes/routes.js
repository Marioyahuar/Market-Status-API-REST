const express = require("express");
const router = express.Router();
const WebSocket = require("ws");
const CRC = require("crc-32");
const _ = require("lodash");

const BOOKS = [];

// Websockets
const ws = new WebSocket("wss://api.bitfinex.com/ws/2");

///suscription
ws.on("open", () => {
  //Initialize book

  // send websocket conf event with checksum flag
  ws.send(JSON.stringify({ event: "conf", flags: 131072 }));

  // send subscribe to get desired book updates
  ws.send(
    JSON.stringify({
      event: "subscribe",
      channel: "book",
      pair: "tBTCUSD",
      prec: "P0",
    })
  );
  ws.send(
    JSON.stringify({
      event: "subscribe",
      channel: "book",
      pair: "tETHUSD",
      prec: "P0",
    })
  );
});

///Receive data from websocket
ws.on("message", function (msg) {
  msg = JSON.parse(msg);
  //console.log(msg)
  if (msg.event) {
    if (msg.event !== "subscribed") return;
    else {
      BOOKS.push(createOrderbook(msg.pair, msg.chanId));
    }
  }

  if (msg[1] === "hb") return;

  let orderbookIndex = getOrderbookIndex(msg[0]);

  // if msg contains checksum, perform checksum
  if (msg[1] === "cs") {
    console.log(msg);
    //console.log(BOOKS[orderbookIndex].chanId)
    const checksum = msg[2];
    const csdata = [];
    const BOOK = BOOKS[orderbookIndex];
    //console.log(BOOK);
    const bidsKeys = BOOK.psnap["bids"];
    const asksKeys = BOOK.psnap["asks"];

    // collect all bids and asks into an array
    for (let i = 0; i < 25; i++) {
      if (bidsKeys[i]) {
        const price = bidsKeys[i];
        const pp = BOOK.bids[price];
        csdata.push(pp.price, pp.amount);
      }
      if (asksKeys[i]) {
        const price = asksKeys[i];
        const pp = BOOK.asks[price];
        csdata.push(pp.price, -pp.amount);
      }
    }

    // create string of array to compare with checksum
    const csStr = csdata.join(":");
    const csCalc = CRC.str(csStr);
    if (csCalc !== checksum) {
      console.error("CHECKSUM FAILED");
      //process.exit(-1);
    } else {
      console.log("Checksum: " + checksum + " success!");
    }
    return;
  }
  //console.log((orderbookIndex != -1) ? orderbookIndex : 'No orderbook created yet');
  if (orderbookIndex == -1) return;
  else {
    if (BOOKS[orderbookIndex].mcnt === 0) {
      //create book
      _.each(msg[1], function (pp) {
        pp = { price: pp[0], cnt: pp[1], amount: pp[2] };
        const side = pp.amount >= 0 ? "bids" : "asks";
        pp.amount = Math.abs(pp.amount);
        BOOKS[orderbookIndex][side][pp.price] = pp;
      });
    } else {
      //update book
      msg = msg[1];
      const pp = { price: msg[0], cnt: msg[1], amount: msg[2] };

      // if count is zero, then delete price point
      if (!pp.cnt) {
        let found = true;

        if (pp.amount > 0) {
          if (
            pp.price in BOOKS[orderbookIndex]["bids"] &&
            BOOKS[orderbookIndex]["bids"][pp.price] !== undefined
          ) {
            delete BOOKS[orderbookIndex]["bids"][pp.price];
          } else {
            found = false;
          }
        } else if (pp.amount < 0) {
          if (
            pp.price in BOOKS[orderbookIndex]["asks"] &&
            BOOKS[orderbookIndex]["asks"][pp.price] !== undefined
          ) {
            delete BOOKS[orderbookIndex]["asks"][pp.price];
          } else {
            found = false;
          }
        }

        if (!found) {
          console.error("Book delete failed. Price point not found");
        }
      } else {
        // else update price point
        const side = pp.amount >= 0 ? "bids" : "asks";
        pp.amount = Math.abs(pp.amount);
        BOOKS[orderbookIndex][side][pp.price] = pp;
      }

      // save price snapshots. Checksum relies on psnaps!
      _.each(["bids", "asks"], function (side) {
        const sbook = BOOKS[orderbookIndex][side];
        const bprices = Object.keys(sbook);
        const prices = bprices.sort(function (a, b) {
          if (side === "bids") {
            return +a >= +b ? -1 : 1;
          } else {
            return +a <= +b ? -1 : 1;
          }
        });
        BOOKS[orderbookIndex].psnap[side] = prices;
      });
    }
    BOOKS[orderbookIndex].mcnt++;
  }
});

// Routes
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/orderbook/:pair", (req, res) => {
  const { pair } = req.params;
  return res.status(400).send(pair);
});

router.get("/market-depth/:pair/:type/:amount", (req, res) => {
  const { pair, type, amount } = req.params;
  return res.status(400).send(amount);
});

router.get("/books", (req, res) => {
  res.send(BOOKS);
});

module.exports = router;

//functions helpers

function createOrderbook(symbol, chanId) {
  let orderbook = {};
  orderbook.chanId = chanId;
  orderbook.symbol = symbol;
  orderbook.bids = {};
  orderbook.asks = {};
  orderbook.psnap = {};
  orderbook.mcnt = 0;
  console.log("Book created");
  return orderbook;
}

function getOrderbookIndex(chanId) {
  let orderbookIndex = -1;
  for (let i = 0; i < BOOKS.length; i++) {
    if (BOOKS[i].chanId === chanId) {
      return i;
    }
  }

  return -1;
}
