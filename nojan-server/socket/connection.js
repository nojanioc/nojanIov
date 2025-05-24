const net = require("net");

class SocketClient {
  constructor(serverAddress, serverPort) {
    this.serverAddress = serverAddress;
    this.serverPort = serverPort;
    this.client = new net.Socket();
    this.connect();
  }
  connect() {
    this.client.connect(this.serverPort, this.serverAddress, () => {
      console.log("Connected to server");
    });

    this.client.on("data", (data) => {
      console.log("Received response from server:", {
        pure: data.toString("utf8"),
      });
    });

    this.client.on("error", (err) => {
      console.error("Error connecting to server:", err);
    });

    this.client.on("end", () => {
      console.log("Disconnected from server");
    });
  }
  sendData(hexCode) {
    const bufferToSend = Buffer.from(hexCode, "hex");
    this.client.write(bufferToSend);
  }
  endConnection() {
    this.client.end();
  }
}

const connection = new SocketClient("185.155.14.50", 8888);
