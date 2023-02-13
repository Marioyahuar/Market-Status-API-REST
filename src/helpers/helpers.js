const helpers = {};

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

function getOrderbookIndex(books, chanId) {
  let orderbookIndex = -1;
  for (let i = 0; i < books.length; i++) {
    if (books[i].chanId === chanId) {
      return i;
    }
  }

  return -1;
}

function getOrderbookIndexBySymbol(books, symbol) {
  let orderbookIndex = -1;
  for (let i = 0; i < books.length; i++) {
    if (books[i].symbol === symbol) {
      return i;
    }
  }

  return -1;
}

function getTips(orderbook) {
  const tips = {
    bestBid: null,
    bestAsk: null,
  };

  const bids = Object.values(orderbook.bids);
  const asks = Object.values(orderbook.asks);

  if (bids.length > 0) {
    tips.bestBid = {
      price: bids[bids.length - 1].price,
      amount: bids[bids.length - 1].amount,
    };
  }

  if (asks.length > 0) {
    tips.bestAsk = { price: asks[0].price, amount: asks[0].amount };
  }

  return tips;
}

function calculateEffectivePrice(orderbook, type, amount) {
  let orders = orderbook[type === "buy" ? "asks" : "bids"];
  let keys = Object.keys(orders);
  let effectivePrice = 0;
  let tradedAmount = 0;

  for (let i = 0; i < keys.length; i++) {
    let order = orders[keys[i]];

    if (tradedAmount + order.amount >= amount) {
      effectivePrice = order.price;
      break;
    } else {
      tradedAmount += order.amount;
    }
  }

  return effectivePrice;
}

function calculateEffectivePriceVwap(orderbook, type, amount) {
  let sum = 0;
  let volume = 0;
  let data = type === "buy" ? orderbook.asks : orderbook.bids;
  let prices = Object.keys(data).sort((a, b) =>
    type === "buy" ? a - b : b - a
  );

  for (let i = 0; i < prices.length; i++) {
    let price = prices[i];
    let priceVolume = data[price].amount;
    if (volume + priceVolume <= amount) {
      sum += price * priceVolume;
      volume += priceVolume;
    } else {
      let remainingVolume = amount - volume;
      sum += price * remainingVolume;
      volume += remainingVolume;
      break;
    }
  }

  return sum / amount;
}

function calculateEffectivePriceAndMaxOrderSize(orderbook, operation, amount, limit) {
  let data = operation === "buy" ? orderbook.asks : orderbook.bids;
  let prices = Object.keys(data).sort((a, b) =>
    operation === "buy" ? a - b : b - a
  );
  let volume = 0;
  let prevEffectivePrice = 0;
  let effectivePrice = 0;
  let effectivePriceForAmount = calculateEffectivePriceVwap(
    orderbook,
    operation,
    amount
  );
  for (let i = 0; i < prices.length; i++) {
    let price = prices[i];
    let priceVolume = data[price].amount;
    effectivePrice = calculateEffectivePriceVwap(
      orderbook,
      operation,
      volume + priceVolume
    );
    if (effectivePrice <= limit) {
      volume += priceVolume;
      prevEffectivePrice = effectivePrice;
    } else {
      let remainingVolume =
        ((limit - prevEffectivePrice) * volume) / (price - limit);
      volume += remainingVolume;
      effectivePrice = limit;
      break;
    }
  }

  return { volume, effectivePrice, effectivePriceForAmount };
}

helpers.createOrderbook = createOrderbook;
helpers.getOrderbookIndex = getOrderbookIndex;
helpers.getOrderbookIndexBySymbol = getOrderbookIndexBySymbol;
helpers.getTips = getTips;
helpers.calculateEffectivePrice = calculateEffectivePrice;
helpers.calculateEffectivePriceVwap = calculateEffectivePriceVwap;
helpers.calculateEffectivePriceAndMaxOrderSize = calculateEffectivePriceAndMaxOrderSize;

module.exports = helpers;
