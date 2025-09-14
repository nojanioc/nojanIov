import { io, Socket } from "socket.io-client";

const deviceSocket = (
  token: string,
  deviceName: "pizzaoven" | "dishwasher"
): Socket => {
  // Connect to the backend server, not the frontend
  const serverUrl =
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3001";
  return io(serverUrl, {
    auth: {
      token,
      deviceName,
    },
  });
};

export default deviceSocket;
