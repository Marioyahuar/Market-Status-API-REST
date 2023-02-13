# membrane-backend-cc
# Market Status API REST

This is a REST API that retrieves market information for trading pairs. The API provides the tips of the orderbook for a specific pair and the effective price for a trade. The backend consumes data from an external exchange through a WebSocket connection.

## Prerequisites

Node.js

## Installation

Clone the repository and install the dependencies:

```
git clone https://github.com/your-username/trading-pair-market-information-api.git
cd trading-pair-market-information-api
npm install
```

Usage
Start the server:

```
npm start
```

The API will be available at **http://localhost:3000**.

## Endpoints

### Get Orderbook

Retrieve the tips of the orderbook for a specific pair.

```
GET /orderbook/:pair
```

#### Parameters

pair: The symbol for the trading pair, for example 'BTCUSD'.

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

Retrieve the effective price for an order execution.

```
GET /market-depth/:pair/:type/:amount/:limit?
```

#### Parameters

pair: The symbol for the trading pair, for example 'BTCUSD'.
type: The type of the operation, either 'buy' or 'sell'.
amount: The amount to be operated.
limit: Optional. The maximum effective price that the user is willing to pay. When a limit value is provided, endpoint also returns the maximum order size that can be executed.

#### Examples

```
GET /market-depth/BTCUSD/buy/2/
```
```
GET /market-depth/BTCUSD/buy/2/21385
```

####Responses

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

### Support

If you encounter any issues, please contact me at myahuarcanisalinas@gmail.com

### Contributing

If you would like to contribute to the project, please fork the repository and submit a pull request.

### License

This project is licensed under the MIT license.
