const express = require("express");
const router = express.Router();
const helpers = require("../helpers/helpers");
const { json } = require("express");
const BOOKS = require("../helpers/bitfinexBooks");

// Routes
router.get("/", (req, res) => {
  res.render("index");
});

// First Endpoint to retrieve best tips for the pair selected
router.get("/orderbook/:pair", (req, res) => {
  const { pair } = req.params;
  const bookIndex = helpers.getOrderbookIndexBySymbol(BOOKS, pair);
  const tips =
    bookIndex != -1
      ? helpers.getTips(BOOKS[bookIndex])
      : "API does not support this pair yet =( If you want to add this pair please contact me: myahuarcanisalinas@gmail.com";

  return res.status(400).send(tips);
});

//Second Endpoint to retrieve the effective price that will result if the order is executed
//Includes a limit parameter to set a limit to the effective price and the maximum order size that could be executed
router.get("/market-depth/:pair/:type/:amount/:limit?", (req, res) => {
  const { pair, type, amount, limit = null } = req.params;
  const bookIndex = helpers.getOrderbookIndexBySymbol(BOOKS, pair);
  console.log(BOOKS[bookIndex]);
  if (bookIndex === -1)
    return res
      .status(400)
      .send(
        "API does not support this pair yet =( If you want to add this pair please contact me: myahuarcanisalinas@gmail.com"
      );
  let effectivePriceInfo = {
    effectivePrice: 0,
    maxOrderSize: 0,
    effectivePriceForMaxOrderSize: 0,
  };

  if (limit === null) {
    effectivePriceInfo = {
      effectivePrice: helpers.calculateEffectivePriceVwap(
        BOOKS[bookIndex],
        type,
        amount
      ),
      maxOrderSize: null,
      effectivePriceForMaxOrderSize: null,
    };
  } else {
    effectPrice = helpers.calculateEffectivePriceAndMaxOrderSize(
      BOOKS[bookIndex],
      type,
      amount,
      limit
    );
    effectivePriceInfo = {
      effectivePrice: effectPrice.effectivePriceForAmount,
      maxOrderSize:
        effectPrice.volume === 0
          ? "No order can be executed at the indicated limit price"
          : effectPrice.volume,
      effectivePriceForMaxOrderSize:
        effectPrice.volume === 0
          ? "No order can be executed at the indicated limit price"
          : effectPrice.effectivePrice,
    };
  }

  const formattedString = `
  <strong>Effective price for amount required:</strong> ${
    effectivePriceInfo.effectivePrice
  } USD<br>
  <strong>Maximum order size for limit price:</strong> ${
    effectivePriceInfo.maxOrderSize || "Not required"
  }<br>
  <strong>Effective price for maximum order size:</strong> ${
    effectivePriceInfo.effectivePriceForMaxOrderSize || "Not required"
  } USD<br>
  <strong>Total price if order is executed:</strong> ${
    effectivePriceInfo.effectivePrice * amount
  } USD
  `;
  return res.status(400).send(`<pre>${formattedString}</pre>`);
});

module.exports = router;
