# membrane-backend-cc
# Market Status API REST

This is a REST API that retrieves market information for trading pairs. The API provides the tips of the orderbook for a specific pair and the effective price for a trade. The backend consumes data from an external exchange through a WebSocket connection.

## Prerequisites

* Node.js

## Installation

Clone the repository and install the dependencies:

```
git clone https://github.com/Marioyahuar/membrane-backend-cc.git
cd membrane-backend-cc
npm install
```

Usage
Start the server:

```
npm start
```

The API will be available at **http://localhost:3000**.

## Endpoints

### Get Orderbook Tips

Retrieve the tips of the orderbook for a specific pair.

```
GET /orderbook/:pair
```

#### Parameters

* pair: The symbol for the trading pair, for example 'BTCUSD'. **Supported pairs: BTCUSD, ETHUSD.**

#### Example

```
GET /orderbook/BTCUSD
```

#### Response

```
{
"bestBid":{"price":21537,"amount":0.011},
"bestAsk":{"price":21538,"amount":1.20950904}
}
```

### Get Effective Price

Retrieve the effective price for an order execution. The API implements the effective price calculation using the Volume Weighted Average Price (VWAP) method. VWAP is calculated by summing the total volume traded and dividing by the total cost of all trades in a given period of time.

```
GET /market-depth/:pair/:type/:amount/:limit?
```

#### Parameters

* pair: The symbol for the trading pair, for example 'BTCUSD'. **Supported pairs: BTCUSD, ETHUSD.**
* type: The type of the operation, either 'buy' or 'sell'.
* amount: The amount to be operated.
* limit: Optional. The maximum effective price that the user is willing to pay. When a limit value is provided, endpoint also returns the maximum order size that can be executed.

#### Examples

```
GET /market-depth/BTCUSD/buy/2/
```
```
GET /market-depth/BTCUSD/buy/2/21385
```

#### Responses

```
{ Effective price for amount required: 21508.06010605, 
Maximum order size for limit price: Not required, 
Effective price for maximum order size: Not required }
```

```
{ Effective price for amount required: 21502.37850446, 
Maximum order size for limit price: 11.245565042005135, 
Effective price for maximum order size: 21510 }
```
### Additional trading pairs

One of the strengths of the API is its ability to easily add additional trading pairs. To add a new pair, simply subscribe to the respective websocket stream and that's all. The API will handle the rest.

Example:

```
ws.send(
    JSON.stringify({
      event: "subscribe",
      channel: "book",
      pair: "tSOLUSD",
      prec: "P0",
    })
  );
```

This makes it easy to add support for new trading pairs as they become available, without having to make significant changes to the API. You can check all Bitfinex available pairs in: https://api-pub.bitfinex.com/v2/conf/pub:list:pair:exchange

Please note that after adding a new trading pair by subscribing to its websocket stream, you will also need to add the pair symbol in the user interface if you want to fetch the market information from there. This can be done by updating the user interface to include the new pair symbol in the dropdown.  

```
<select id="pair-input">
      <option value="BTCUSD">BTC-USD</option>
      <option value="ETHUSD">ETH-USD</option>
      <option value="SOLUSD">SOL-USD</option>
</select>
```

I'm currently working on an even simpler way of adding new trading pairs. The goal is to make the process as straightforward as possible, so that adding new pairs is as easy as a few clicks or even automatically.

Stay tuned for updates on this feature!

### Other features

* Checksum Verification: The API supports the option to request that checksums be sent through the WebSocket connection and makes the calculations to verify that the orderbook data is correct and up to date. See the result in console while the server is running:

```
Checksum: -1508730772 success!
Checksum: -903310496 success!
```
* HTML interface: The API support a simple HTTP interface to fetch the endpoints.

### Upcoming features

I'm working to improve the API and provide the best experience for users. Here are some of the upcoming features i'm working on:

* Creation of a set of units tests for the logic used in the effective price calculation
* Real-time display of the tips of the orderbook in the user interface
* Improved performance and scalability

If you have any suggestions or ideas for new features, please open an issue in the repository and let me know. I would love to hear from you!


### Support

If you encounter any issues, please contact me at myahuarcanisalinas@gmail.com or open a new issue in the Issues section.

### Contributing

If you would like to contribute to the project, please fork the repository and submit a pull request.

### License

This project is licensed under the MIT license.
