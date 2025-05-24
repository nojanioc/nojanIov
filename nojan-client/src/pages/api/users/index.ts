import errorHandler from "@/utils/errorHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongodb } from "../../../../lib/mongodb";
import authMiddleware from "../../../../middleware/authMiddleware";
import User from "../../../../models/user";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await authMiddleware(
    req,
    res,
    async (req: NextApiRequest, res: NextApiResponse) => {
      if (req.method === "GET") {
        if (req?.user?.role !== "admin") {
          return res
            .status(403)
            .json({ error: "دسترسی این عملیات فقط با ادمین !" });
        }

        await connectMongodb();
        const response = (await User.find().select("-_id")).filter(
          (e) => e?.email !== req?.user?.email
        );
        res
          .status(201)
          .json({ users: response, message: "عملیات با موفقیت انجام شد" });
      }
    }
  );
}

export default errorHandler(handler);
