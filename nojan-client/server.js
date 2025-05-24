const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const http = require("http");
const socketIO = require("socket.io");

app.prepare().then(async () => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIO(httpServer);

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("01", (data) => {
      console.log("Recieved from API 01::", data);
      io.emit("message2", data);
    });

    socket.on("02", (data) => {
      console.log("Recieved from API 02::", data);
      io.emit("message2", data);
    });

    socket.on("03", (data) => {
      console.log("Recieved from API 03::", data);
      io.emit("message2", data);
    });

    socket.on("04", (data) => {
      console.log("Recieved from API 04::", data);
      io.emit("message2", data);
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
