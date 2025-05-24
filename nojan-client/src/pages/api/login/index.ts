import errorHandler from "@/utils/errorHandler";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongodb } from "../../../../lib/mongodb";
import User from "../../../../models/user";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      await connectMongodb();
      const user = await User.findOne({ email, password });
      if (!user) {
        return res
          .status(401)
          .json({ message: "نام کاربری یا گذرواژه اشتباه است !" });
      }

      const token = jwt.sign(
        { email: user.email, password: user.password, role: user.role },
        process.env.SECRET_KEY || "",
        {
          expiresIn: "24h",
        }
      );

      if (token) {
        res.json({
          message: "Login successful",
          token,
          role: user.role,
          email: user.email,
          machines: user.machines,
        });
      } else {
        return res
          .status(401)
          .json({ message: "نام کاربری یا گذرواژه اشتباه است !" });
      }
    } catch (e) {}
  }
}

export default errorHandler(handler);
