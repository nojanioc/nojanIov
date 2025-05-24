import { io, Socket } from "socket.io-client";

const deviceSocket = (token: string): Socket => {
  return io(process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "", {
    auth: {
      token,
    },
  });
};

export default deviceSocket;
