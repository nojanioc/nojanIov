import { io, Socket } from "socket.io-client";

const deviceSocket = (token: string): Socket => {
  // Connect to the backend server, not the frontend
  const serverUrl =
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3001";
  return io(serverUrl, {
    auth: {
      token,
    },
  });
};

export default deviceSocket;
