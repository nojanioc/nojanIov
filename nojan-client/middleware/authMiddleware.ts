import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const secretKey = process.env.SECRET_KEY;

const authMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (req: NextApiRequest, res: NextApiResponse) => void
) => {
  const token = req?.headers?.authorization || req.query.authorization;

  if (!token) {
    return res.status(403).json({ error: "Token not provided" });
  }

  //@ts-ignore
  const updatedToken = token?.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(updatedToken, secretKey || "") as {
      [key: string]: any;
    };
    req.user = decoded;
    next(req, res);
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default authMiddleware;
