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
      if (req.method === "DELETE") {
        if (req?.user?.role !== "admin") {
          return res
            .status(403)
            .json({ error: "دسترسی این عملیات فقط با ادمین !" });
        }
        await connectMongodb();
        const email = req.query.id;
        try {
          await User.deleteOne({ email });
          res.status(201).json({ message: "کاربر با موفقیت حذف شد" });
        } catch (e) {
          res.status(404).json({ error: "کاربری با این مشخصات یافت نشد" });
        }
      }
    }
  );
}

export default errorHandler(handler);
