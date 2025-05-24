const net = require("net");

function sendData(code) {
  const serverAddress = "185.155.14.50";
  const serverPort = 8888;

  const client = net.createConnection(
    { host: serverAddress, port: serverPort },
    () => {
      console.log("Connected to server");
      client.write(Buffer.from(code, "hex"));
      // client.write("0");
      // client.write("07");
      console.log("Data sent!");
    }
  );
}

sendData("01");
