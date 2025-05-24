import errorHandler from "@/utils/errorHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "ws";
import authMiddleware from "./authMiddleware";

async function createWebSocket(req: NextApiRequest, res: NextApiResponse) {
  await authMiddleware(
    req,
    res,
    async (req: NextApiRequest, res: NextApiResponse) => {
      const wss = new Server({ noServer: true });
      const wsToWebSocketServer: any = new WebSocket("ws://localhost:8080");
      function broadcast(data: string | number) {
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      }

      wss.on("connection", (ws) => {
        ws.on("message", (message) => {
          wsToWebSocketServer.send(message);
        });

        ws.send("Connected to WebSocket server");
      });

      wsToWebSocketServer.on(
        "message",
        function incoming(data: number | string) {
          broadcast(data);
        }
      );

      //@ts-ignore
      if (!res?.socket?.server) {
        console.log("Socket not available");
        return;
      }

      wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  );
}

export default errorHandler(createWebSocket);
