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
      if (req.method === "POST") {
        if (req?.user?.role !== "admin") {
          return res
            .status(403)
            .json({ error: "دسترسی این عملیات فقط با ادمین !" });
        }

        const { email, password, role = "user", machines } = req.body;
        await connectMongodb();
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
          res.status(403).json({ error: "ایمیل وارد شده تکراری است !" });
          return;
        }

        const response = await User.create({ email, password, role, machines });
        res
          .status(201)
          .json({ user: response, message: "کاربر با موفقیت ساخته شد" });
      }
    }
  );
}

export default errorHandler(handler);
