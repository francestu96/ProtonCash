import User from "model/User";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "utils/dbConnect";

interface ResponseData {
  error?: string;
  msg?: string;
}

const validateTelegramId = (telegramId: string): boolean => {
  const regEx = /(?=.{5,64}(?:\s|$))(?![_])(?!.*[_]{2})[a-zA-Z0-9_]+(?<![_.])/i;
  return regEx.test(telegramId);
};

const validateForm = async (name: string, telegramId: string, password: string) => {
  if (name.length < 3) {
    return { error: "Name must have 3 or more characters" };
  }
  if (!validateTelegramId(telegramId)) {
    return { error: "Telegram ID is invalid" };
  }

  await dbConnect();
  const telegramIdUser = await User.findOne({ telegramId: telegramId });

  if (telegramIdUser) {
    return { error: "Telegram ID already exists" };
  }

  if (password.length < 8) {
    return { error: "Password must have 8 or more characters" };
  }

  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    return res
      .status(200)
      .json({ error: "This API call only accepts POST methods" });
  }

  const { name, telegramId, password } = req.body;

  const errorMessage = await validateForm(name, telegramId, password);
  if (errorMessage) {
    return res.status(400).json(errorMessage as ResponseData);
  }

  const newUser = new User({ name, telegramId, password });

  newUser.save().then(() =>
      res.status(200).json({ msg: "Successfuly created new User: " + newUser })
    )
    .catch((err: string) =>
      res.status(400).json({ error: "Error on '/api/register': " + err })
    );
}
