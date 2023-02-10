const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/orderbook/:pair", (req, res) => {
    const {pair} = req.params;
    return res.status(400).send(pair);
});

router.get("/market-depth/:pair/:type/:amount", (req, res) => {
    const {pair, type, amount} = req.params;
    return res.status(400).send(amount);
});

module.exports = router;
