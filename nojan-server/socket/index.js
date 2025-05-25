const { Server } = require("socket.io");
const authenticateSocket = require("./authenticateSocket");
const net = require("net");
const { updateHistory } = require("../handlers/history");
const User = require("../models/user");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://37.32.15.0:3000"], // Allow both localhost and IP address
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.use(authenticateSocket);
  io.on("connection", async (socket) => {
    try {
      console.log("New client connected");

      const user = await User.findOne({ email: socket.user.email });
      if (!user) {
        console.error("User not found:", socket.user.email);
        socket.emit("error", "User not found");
        return;
      }

      let externalSocket = null;

      socket.on("connectToDevice", async (deviceName) => {
        console.log("Attempting to connect to device:", deviceName);

        const device = user.devices.find((d) => d.name === deviceName);

        if (!device) {
          console.error("Device access denied:", deviceName);
          socket.emit("error", "No access to this device");
          return;
        }

        if (externalSocket) {
          externalSocket.destroy();
          externalSocket = null;
        }

        externalSocket = new net.Socket();
        const serverPort = 8888;

        externalSocket.on("data", (data) => {
          try {
            console.log("Received data from device:", data.toString());
            socket.emit("data", data.toString());
            updateHistory(data.toString(), deviceName, device.ip);
          } catch (error) {
            console.error("Error processing device data:", error);
            socket.emit("error", "Failed to process device data");
          }
        });

        externalSocket.on("error", (err) => {
          console.error("Device connection error:", err);
          socket.emit("error", "Device connection error: " + err.message);
          externalSocket.destroy();
          externalSocket = null;
        });

        externalSocket.on("close", () => {
          console.log("Connection to device closed");
          socket.emit("disconnected", "Device disconnected");
          externalSocket = null;
        });

        externalSocket.connect(serverPort, device.ip, () => {
          console.log("Connected to device at", device.ip);
          externalSocket.write(Buffer.from("01", "hex"));
          socket.emit("connected");
        });
      });

      socket.on("data", (data) => {
        try {
          if (!externalSocket) {
            console.error("No device connection available");
            socket.emit("error", "Not connected to device");
            return;
          }
          console.log("Received data from client:", data);
          const valueLength = data.toString().length;

          const decimalToHex = (decimal) => {
            const hex = parseInt(decimal).toString(16).padStart(2, "0");
            return hex;
          };

          if (valueLength > 2) {
            externalSocket.write(Buffer.from("06", "hex"));
            setTimeout(() => {
              const decimalValue = data.slice(2);
              const hexValue = decimalToHex(decimalValue);
              externalSocket.write(Buffer.from(hexValue, "hex"));
            }, 500);
          } else {
            console.log("Sending data to device:", data);
            externalSocket.write(Buffer.from(data, "hex"));
          }
        } catch (error) {
          console.error("Error forwarding data to device:", error);
          socket.emit("error", "Failed to forward data to device");
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected, cleaning up connections");
        if (externalSocket) {
          externalSocket.destroy();
          externalSocket = null;
        }
      });
    } catch (error) {
      console.error("Socket connection error:", error);
      socket.emit("error", "Connection error: " + error.message);
    }
  });

  return io;
};

module.exports = initializeSocket;
