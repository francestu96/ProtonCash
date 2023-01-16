import User from "model/User";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "utils/dbConnect";

interface ResponseData {
  error?: string;
  msg?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    return res.status(200).json({ error: "This API call only accepts POST methods" });
  }

  const { telegramId, address } = req.body;

  await dbConnect();
  const telegramIdUser = await User.findOneAndUpdate({ telegramId }, {address});

  if (!telegramIdUser) {
    return res.status(400).json({ error: "Telegram ID not found" } as ResponseData);
  }

  return res.status(200).json({ msg: "Successfuly update user " + telegramIdUser.telegramId })
}
