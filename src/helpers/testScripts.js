const orderBook = {
  bids: {
    21809: { price: 21809, cnt: 2, amount: 2.99484591 },
    21810: { price: 21810, cnt: 1, amount: 0.036 },
    21811: { price: 21811, cnt: 1, amount: 0.45678251 },
    21812: { price: 21812, cnt: 2, amount: 13.46873 },
    21813: { price: 21813, cnt: 1, amount: 0.97869738 },
    21815: { price: 21815, cnt: 1, amount: 0.64817321 },
    21817: { price: 21817, cnt: 1, amount: 0.2 },
    21818: { price: 21818, cnt: 3, amount: 8.783279 },
    21819: { price: 21819, cnt: 1, amount: 0.59322103 },
    21820: { price: 21820, cnt: 1, amount: 0.58290846 },
    21822: { price: 21822, cnt: 2, amount: 0.1305842 },
    21823: { price: 21823, cnt: 3, amount: 0.40417004 },
    21824: { price: 21824, cnt: 5, amount: 1.392297 },
    21825: { price: 21825, cnt: 2, amount: 0.46917 },
    21826: { price: 21826, cnt: 2, amount: 0.5032 },
    21827: { price: 21827, cnt: 3, amount: 1.18702783 },
    21828: { price: 21828, cnt: 3, amount: 0.8033 },
    21829: { price: 21829, cnt: 4, amount: 0.80240678 },
    21830: { price: 21830, cnt: 2, amount: 2.7006 },
    21831: { price: 21831, cnt: 4, amount: 4.70456011 },
    21832: { price: 21832, cnt: 7, amount: 1.60600416 },
    21833: { price: 21833, cnt: 4, amount: 0.82876405 },
    21834: { price: 21834, cnt: 3, amount: 0.792699 },
    21835: { price: 21835, cnt: 2, amount: 0.707977 },
    21836: { price: 21836, cnt: 2, amount: 0.50042244 },
  },
  asks: {
    21837: { price: 21837, cnt: 3, amount: 0.34805321 },
    21839: { price: 21839, cnt: 3, amount: 0.35568987 },
    21840: { price: 21840, cnt: 4, amount: 0.76718483 },
    21841: { price: 21841, cnt: 3, amount: 0.52490903 },
    21842: { price: 21842, cnt: 3, amount: 0.79174 },
    21843: { price: 21843, cnt: 6, amount: 1.49911229 },
    21844: { price: 21844, cnt: 3, amount: 0.43867158 },
    21845: { price: 21845, cnt: 3, amount: 1.07698924 },
    21846: { price: 21846, cnt: 6, amount: 1.73166616 },
    21847: { price: 21847, cnt: 4, amount: 0.85009118 },
    21848: { price: 21848, cnt: 6, amount: 3.52809753 },
    21849: { price: 21849, cnt: 2, amount: 0.78936363 },
    21850: { price: 21850, cnt: 3, amount: 1.1727 },
    21851: { price: 21851, cnt: 2, amount: 0.26 },
    21852: { price: 21852, cnt: 3, amount: 0.717625 },
    21853: { price: 21853, cnt: 3, amount: 0.62555423 },
    21854: { price: 21854, cnt: 3, amount: 0.01916077 },
    21855: { price: 21855, cnt: 3, amount: 0.93018073 },
    21856: { price: 21856, cnt: 1, amount: 0.83484106 },
    21857: { price: 21857, cnt: 2, amount: 2.42740884 },
    21858: { price: 21858, cnt: 2, amount: 2.6264 },
    21860: { price: 21860, cnt: 2, amount: 0.21792308 },
    21861: { price: 21861, cnt: 1, amount: 0.01 },
    21862: { price: 21862, cnt: 1, amount: 0.01 },
    21863: { price: 21863, cnt: 2, amount: 0.71128521 },
  },
};

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

  if(amount > volume) {
    return 'The amount requested exceeds the maximum order size'
  }else{
    return sum/amount
  }
}

function calculateMaxOrderSize(orderbook, operation, limit, amount) {
  let data = operation === "buy" ? orderbook.asks : orderbook.bids;
  let prices = Object.keys(data).sort((a, b) =>
    operation === "buy" ? a - b : b - a
  );
  let volume = 0;

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
    } else {
      effectivePrice = calculateEffectivePriceVwap(
        orderbook,
        operation,
        volume
      );
      let remainingVolume =
        ((limit - effectivePrice) * volume) / (price - limit);
      volume += remainingVolume;
      effectivePrice = limit;
      break;
    }
  }

  return { volume, effectivePrice };
}

function calculateMaxOrderSize2(orderbook, operation, amount, limit) {
  let data = operation === "buy" ? orderbook.asks : orderbook.bids;
  let prices = Object.keys(data).sort((a, b) =>
    operation === "buy" ? a - b : b - a
  );
  let volume = 0;
  let prevEffectivePrice = 0;
  let effectivePrice = 0;
  let effectivePriceForAmount = calculateEffectivePriceVwap(orderbook,operation,amount);
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

  return { volume, effectivePrice, effectivePriceForAmount};
}
const price = calculateEffectivePriceVwap(orderBook, "buy", 10);
const maxorder = calculateMaxOrderSize2(orderBook, "buy", 2, 21838);

console.log(price);
console.log(maxorder);


router.get("/market-depth/:pair/:type/:amount/:limit?", (req, res) => {
  const { pair, type, amount, limit = null } = req.params;
  const bookIndex = helpers.getOrderbookIndexBySymbol(BOOKS, pair);
  let effectivePriceInfo = {
    effectivePrice: 0,
    maxOrderSize: 0,
    effectivePriceForMaxOrderSize: 0
  }

  if(limit === null){
    effectivePriceInfo = {
      effectivePrice: helpers.calculateEffectivePriceVwap(BOOKS[bookIndex], type, amount),
      maxOrderSize: 'Not required',
      effectivePriceForMaxOrderSize: 'Not required'
    }
  }
  else{
    effectPrice = helpers.calculateEffectivePriceAndMaxOrderSize(BOOKS[bookIndex], type, amount, limit)
    console.log(effectPrice)
    effectivePriceInfo = {
      effectivePriceInfo: effectPrice.effectivePrice,
      maxOrderSize: effectPrice.volume,
      effectivePriceForMaxOrderSize: effectPrice.effectivePriceForAmount
    }
  }

  console.log(effectivePriceInfo)
  return res.status(400).send(effectivePriceInfo);
});
