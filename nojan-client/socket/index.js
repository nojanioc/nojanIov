const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let number = "12345678901"; // Initial number

// Function to broadcast message to all clients
function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.send(number); // Send initial number to the client upon connection

  ws.on("message", function incoming(message) {
    console.log("Received: %s", message);
    if (message === "0") {
      number = number.substring(0, 1) + "1" + number.substring(2);
    } else if (message === "1") {
      number = number.substring(0, 1) + "2" + number.substring(2);
    } else if (message === "2") {
      number = number.substring(0, 1) + "3" + number.substring(2);
    } else if (message === "3") {
      number = number.substring(0, 1) + "0" + number.substring(2);
    }
    console.log("Number:", number);
    broadcast(number); // Broadcast the updated number to all clients
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

server.listen(8080, function listening() {
  console.log("Server started on port 8080");
});
