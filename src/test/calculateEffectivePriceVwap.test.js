const helpers = require("../helpers/helpers");
const calculateEffectivePriceVwap = helpers.calculateEffectivePriceVwap;
const orderBook = {
  "chanId": 350307,
  "symbol": "BTCUSD",
  "bids": {
    "22115": { "price": 22115, "cnt": 2, "amount": 13.2543 },
    "22116": { "price": 22116, "cnt": 3, "amount": 2.71048148 },
    "22117": { "price": 22117, "cnt": 2, "amount": 4.27278182 },
    "22119": { "price": 22119, "cnt": 4, "amount": 10.12448526 },
    "22120": { "price": 22120, "cnt": 3, "amount": 2.89916163 },
    "22121": { "price": 22121, "cnt": 2, "amount": 1.01788862 },
    "22122": { "price": 22122, "cnt": 4, "amount": 4.70862096 },
    "22123": { "price": 22123, "cnt": 2, "amount": 0.08248 },
    "22124": { "price": 22124, "cnt": 5, "amount": 1.50210436 },
    "22125": { "price": 22125, "cnt": 2, "amount": 0.08248 },
    "22126": { "price": 22126, "cnt": 6, "amount": 0.91915087 },
    "22127": { "price": 22127, "cnt": 3, "amount": 0.985592 },
    "22128": { "price": 22128, "cnt": 7, "amount": 5.10228836 },
    "22129": { "price": 22129, "cnt": 2, "amount": 0.08176 },
    "22130": { "price": 22130, "cnt": 4, "amount": 0.90780824 },
    "22131": { "price": 22131, "cnt": 2, "amount": 0.1162778 },
    "22132": { "price": 22132, "cnt": 5, "amount": 0.66312058 },
    "22133": { "price": 22133, "cnt": 5, "amount": 0.909459 },
    "22134": { "price": 22134, "cnt": 7, "amount": 1.17429125 },
    "22135": { "price": 22135, "cnt": 3, "amount": 3.06538 },
    "22136": { "price": 22136, "cnt": 1, "amount": 0.26994513 },
    "22137": { "price": 22137, "cnt": 4, "amount": 1.38719424 },
    "22138": { "price": 22138, "cnt": 1, "amount": 0.10812774 },
    "22139": { "price": 22139, "cnt": 2, "amount": 0.903352 },
    "22140": { "price": 22140, "cnt": 1, "amount": 0.451656 }
  },
  "asks": {
    "22141": { "price": 22141, "cnt": 4, "amount": 0.497194 },
    "22142": { "price": 22142, "cnt": 3, "amount": 0.56711092 },
    "22143": { "price": 22143, "cnt": 1, "amount": 0.58092358 },
    "22144": { "price": 22144, "cnt": 8, "amount": 1.88145683 },
    "22145": { "price": 22145, "cnt": 7, "amount": 1.68104671 },
    "22146": { "price": 22146, "cnt": 6, "amount": 1.56086746 },
    "22147": { "price": 22147, "cnt": 2, "amount": 0.09274442 },
    "22148": { "price": 22148, "cnt": 4, "amount": 1.29124295 },
    "22149": { "price": 22149, "cnt": 4, "amount": 0.83138635 },
    "22150": { "price": 22150, "cnt": 2, "amount": 0.43377207 },
    "22151": { "price": 22151, "cnt": 1, "amount": 0.07072 },
    "22152": { "price": 22152, "cnt": 3, "amount": 0.2662878 },
    "22153": { "price": 22153, "cnt": 3, "amount": 1.88664039 },
    "22154": { "price": 22154, "cnt": 3, "amount": 0.62312145 },
    "22155": { "price": 22155, "cnt": 3, "amount": 0.53224 },
    "22156": { "price": 22156, "cnt": 4, "amount": 2.96841 },
    "22157": { "price": 22157, "cnt": 2, "amount": 0.01891242 },
    "22158": { "price": 22158, "cnt": 3, "amount": 0.81804602 },
    "22159": { "price": 22159, "cnt": 1, "amount": 0.2 },
    "22160": { "price": 22160, "cnt": 3, "amount": 1.13138231 },
    "22161": { "price": 22161, "cnt": 2, "amount": 0.34352276 },
    "22162": { "price": 22162, "cnt": 3, "amount": 2.68530989 },
    "22163": { "price": 22163, "cnt": 3, "amount": 3.90451608 },
    "22164": { "price": 22164, "cnt": 2, "amount": 4.18 },
    "22168": { "price": 22168, "cnt": 3, "amount": 0.70414152 }
  },
  "psnap": {
    "bids": [
      "22140",
      "22139",
      "22138",
      "22137",
      "22136",
      "22135",
      "22134",
      "22133",
      "22132",
      "22131",
      "22130",
      "22129",
      "22128",
      "22127",
      "22126",
      "22125",
      "22124",
      "22123",
      "22122",
      "22121",
      "22120",
      "22119",
      "22117",
      "22116",
      "22115"
    ],
    "asks": [
      "22141",
      "22142",
      "22143",
      "22144",
      "22145",
      "22146",
      "22147",
      "22148",
      "22149",
      "22150",
      "22151",
      "22152",
      "22153",
      "22154",
      "22155",
      "22156",
      "22157",
      "22158",
      "22159",
      "22160",
      "22161",
      "22162",
      "22163",
      "22164",
      "22168"
    ]
  },
  "mcnt": 2590
}

describe("calculateEffectivePriceVwap", () => {
  // Test case 1
  test("Returns 'Not valid type of operation' if type is not 'buy' or 'sell'", () => {
    
    const type = "invalid";
    const amount = 5;
    expect(calculateEffectivePriceVwap(orderBook, type, amount)).toEqual("Not valid type of operation");
  });

  // Test case 2
  test("Returns 'Not amount provided' if amount is null", () => {
   
    const type = "buy";
    const amount = null;
    expect(calculateEffectivePriceVwap(orderBook, type, amount)).toEqual("Not amount provided");
  });

  // Test case 3
  test("Returns 'The amount requested exceeds the maximum order size' if amount is greater than the available volume", () => {
    
    const type = "buy";
    const amount = 60;
    expect(calculateEffectivePriceVwap(orderBook, type, amount)).toEqual("The amount requested exceeds the maximum order size");
  });

  // Test case 4
  test("Calculates the effective price for a buy order", () => {
    type = "buy";
    const amount = 6.5;
    expect(calculateEffectivePriceVwap(orderBook, type, amount)).toBeCloseTo(22144.163, 3);
  });

  // Test case 5
  test("Calculates the effective price for a sell order", () => {
    
    const type = "sell";
    const amount = 3;
    expect(calculateEffectivePriceVwap(orderBook, type, amount)).toBeCloseTo(22138.040, 3);
  });
});