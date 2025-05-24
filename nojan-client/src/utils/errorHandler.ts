import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const errorHandler =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error("Global error handler caught an error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

export default errorHandler;
