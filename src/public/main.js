let socket = null;
function selectPair(pair) {
  if (socket !== null) {
    socket.close();
  }

  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    console.log("Connected to websocket server");
    socket.send(JSON.stringify({ selectedPair: pair }));
  };

  socket.onmessage = (event) => {
    //const data = JSON.parse(event.data);
    const data = JSON.parse(event.data);
    console.log("Received orderbook data:", data);
    document.getElementById("orderbook-response").innerHTML = data;
    // Update the UI with the latest orderbook data
    // ...
  };

  socket.onclose = () => {
    console.log("Disconnected from websocket server");
  };
}

function fetchOrderbook(pair) {
    fetch(`/orderbook/${pair}`)
      .then(response => response.text())
      .then(data => {
        document.getElementById("orderbook-response").innerHTML = data;
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  function fetchMarketDepth(pair, type, amount, limit) {
    console.log('amount ', amount)
    if(!amount) {
        document.getElementById("market-depth-response").innerHTML = 'Please enter a valid amount'; return;}

    fetch(`/market-depth/${pair}/${type}/${amount}/${limit}`)
      .then(response => response.text())
      .then(data => {
        document.getElementById("market-depth-response").innerHTML = data;
      })
      .catch(error => {
        console.error(error);
      });
  }