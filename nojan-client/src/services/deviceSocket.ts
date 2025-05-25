import { io, Socket } from "socket.io-client";

const deviceSocket = (token: string): Socket => {
  // Connect to the backend server, not the frontend
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://37.32.15.0:3001";
  return io(serverUrl, {
    auth: {
      token,
    },
  });
};

export default deviceSocket;
