import errorHandler from "@/utils/errorHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "../../../../middleware/authMiddleware";

import io from "socket.io-client";
const socket = io("http://localhost:3001");

async function handler(req: NextApiRequest, res: NextApiResponse) {
  authMiddleware(req, res, async () => {
    try {
      socket.emit("01", "Akbare cc");
      socket.emit("02", "Akbare bb");
      socket.emit("04", "Akbare aa");
      return res.status(200).json({ message: "Socket connected !" });
    } catch (error) {
      console.error("Error:", error);
    }
  });
}

export default errorHandler(handler);
