let socket = null;
function selectPair(pair) {
  if (socket !== null) {
    socket.close();
  }

  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    socket.send(JSON.stringify({ selectedPair: pair }));
  };

  socket.onmessage = (event) => {
    //const data = JSON.parse(event.data);
    const data = JSON.parse(event.data);
    document.getElementById("orderbook-response").innerHTML = data;
    // Update the UI with the latest orderbook data
    // ...
  };

  socket.onclose = () => {};
}

function fetchOrderbook(pair) {
  fetch(`/orderbook/${pair}`)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("orderbook-response").innerHTML = data;
    })
    .catch((error) => {
      console.error(error);
    });
}

function fetchMarketDepth(pair, type, amount, limit) {
  if (!amount) {
    document.getElementById("market-depth-response").innerHTML =
      "Please enter a valid amount";
    return;
  }

  fetch(`/market-depth/${pair}/${type}/${amount}/${limit}`)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("market-depth-response").innerHTML = data;
    })
    .catch((error) => {
      console.error(error);
    });
}
